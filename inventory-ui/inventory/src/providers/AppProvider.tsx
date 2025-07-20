// providers/AppProviders.tsx
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../slice/store';
import { QueryProvider } from '../features/QueryProvider';
import { ThemeProvider } from '../contexts/ThemeContext';

export const AppProviders = ({ children }: { children: ReactNode }) => (
    <ThemeProvider>
        <Provider store={store}>
            <QueryProvider>
                {children}
            </QueryProvider>
        </Provider>

    </ThemeProvider>

);
export default AppProviders;