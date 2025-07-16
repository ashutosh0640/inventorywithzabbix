// providers/AppProviders.tsx
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../slice/store';
import { QueryProvider } from '../features/QueryProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
        <QueryProvider>
            {children}
        </QueryProvider>
    </Provider>
);
export default AppProviders;