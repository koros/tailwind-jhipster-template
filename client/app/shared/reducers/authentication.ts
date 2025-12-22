import axios, { AxiosResponse } from 'axios';
import { Storage } from 'react-jhipster';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AppThunk } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';
import { serializeAxiosError } from './reducer.utils';

const AUTH_TOKEN_KEY = 'jhi-authenticationToken';
// Refresh token now stored as HttpOnly cookie; no longer kept in web storage
const REFRESH_TOKEN_KEY = 'jhi-refreshToken'; // retained for cleanup of legacy entries

export const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  showModalLogin: false,
  account: {} as any,
  errorMessage: null as unknown as string, // Errors returned from server side
  redirectMessage: null as unknown as string,
  sessionHasBeenFetched: false,
  logoutUrl: null as unknown as string,
  userImage: null as string | null,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Actions

export const getSession = (): AppThunk => async (dispatch, getState) => {
  // Attempt silent refresh if no access token is present but refresh cookie may exist
  let token = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
  if (!token) {
    try {
      const resp = await axios.post('api/refresh-token');
      const { id_token } = resp.data;
      // Always use localStorage for persistent sessions (refresh cookie implies rememberMe)
      Storage.local.set('jhi-authenticationToken', id_token);
      axios.defaults.headers.common.Authorization = `Bearer ${id_token}`;
      token = id_token;
    } catch (e) {
      // ignore; user may not be logged in yet
    }
  }
  await dispatch(getAccount());

  const { account } = getState().authentication;
  if (account && account.langKey) {
    const langKey = Storage.session.get('locale', account.langKey);
    await dispatch(setLocale(langKey));
  }
};

export const getAccount = createAsyncThunk('authentication/get_account', async () => axios.get<any>('api/account'), {
  serializeError: serializeAxiosError,
});

export const getUserImage = createAsyncThunk('authentication/get_user_image', async (_, { dispatch }) => {
  try {
    const response = await axios.get('/api/user-images', { responseType: 'blob' });
    if (response.data && response.data.size > 0) {
      const url = URL.createObjectURL(response.data);
      dispatch(updateUserImage(url));
      return url;
    }
  } catch (e) {
    // ignore
  }
  return null;
});

interface IAuthParams {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export const authenticate = createAsyncThunk(
  'authentication/login',
  async (auth: IAuthParams) => axios.post<any>('api/authenticate', auth),
  {
    serializeError: serializeAxiosError,
  },
);

export const login: (username: string, password: string, rememberMe?: boolean) => AppThunk =
  (username, password, rememberMe = false) =>
  async dispatch => {
    const result = await dispatch(authenticate({ username, password, rememberMe }));
    const response = result.payload as AxiosResponse;
    const bearerToken = response?.headers?.authorization;
    if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
      const jwt = bearerToken.slice(7, bearerToken.length);
      if (rememberMe) {
        Storage.local.set(AUTH_TOKEN_KEY, jwt);
      } else {
        Storage.session.set(AUTH_TOKEN_KEY, jwt);
      }
    }
    // No longer store refresh token (now sent via HttpOnly cookie by server)
    dispatch(getSession());
  };

export const clearAuthToken = () => {
  if (Storage.local.get(AUTH_TOKEN_KEY)) {
    Storage.local.remove(AUTH_TOKEN_KEY);
  }
  if (Storage.session.get(AUTH_TOKEN_KEY)) {
    Storage.session.remove(AUTH_TOKEN_KEY);
  }
  if (Storage.local.get(REFRESH_TOKEN_KEY)) {
    Storage.local.remove(REFRESH_TOKEN_KEY);
  }
  if (Storage.session.get(REFRESH_TOKEN_KEY)) {
    Storage.session.remove(REFRESH_TOKEN_KEY);
  }
};

export const logout: () => AppThunk = () => async dispatch => {
  try {
    await axios.post('api/logout'); // server clears cookie & invalidates refresh token
  } catch {
    // ignore errors during logout
  }
  clearAuthToken();
  dispatch(logoutSession());
  // Broadcast logout to other tabs
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    const channel = new BroadcastChannel('auth');
    channel.postMessage({ type: 'logout' });
    channel.close();
  }
};

export const clearAuthentication = messageKey => dispatch => {
  clearAuthToken();
  dispatch(authError(messageKey));
  dispatch(clearAuth());
};

export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState: initialState as AuthenticationState,
  reducers: {
    logoutSession() {
      return {
        ...initialState,
        showModalLogin: true,
        userImage: null,
      };
    },
    authError(state, action) {
      return {
        ...state,
        showModalLogin: true,
        redirectMessage: action.payload,
      };
    },
    clearAuth(state) {
      return {
        ...state,
        loading: false,
        showModalLogin: true,
        isAuthenticated: false,
      };
    },
    updateUserImage(state, action) {
      state.userImage = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(authenticate.rejected, (state, action) => ({
        ...initialState,
        errorMessage: action.error.message,
        showModalLogin: true,
        loginError: true,
      }))
      .addCase(authenticate.fulfilled, state => ({
        ...state,
        loading: false,
        loginError: false,
        showModalLogin: false,
        loginSuccess: true,
      }))
      .addCase(getAccount.rejected, (state, action) => ({
        ...state,
        loading: false,
        isAuthenticated: false,
        sessionHasBeenFetched: true,
        showModalLogin: true,
        errorMessage: action.error.message,
      }))
      .addCase(getAccount.fulfilled, (state, action) => {
        const isAuthenticated = action.payload && action.payload.data && action.payload.data.activated;
        return {
          ...state,
          isAuthenticated,
          loading: false,
          sessionHasBeenFetched: true,
          account: action.payload.data,
        };
      })
      .addCase(authenticate.pending, state => {
        state.loading = true;
      })
      .addCase(getAccount.pending, state => {
        state.loading = true;
      });
  },
});

export const { logoutSession, authError, clearAuth, updateUserImage } = AuthenticationSlice.actions;

// Reducer
export default AuthenticationSlice.reducer;
