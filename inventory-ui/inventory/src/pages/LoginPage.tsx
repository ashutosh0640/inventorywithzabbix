import React, { useState } from 'react';
import { useAppDispatch } from '../slice/hooks';
import { EyeClosed, Eye, Database, AlertCircle } from 'lucide-react';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import type { LoginReqDTO } from '../types/requestDto';
import { useLogin } from '../features/inventoryQuery/authQuery';

interface LoginPageProps {
    onLoginSuccess: () => void;
}


const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const dispatch = useAppDispatch();
    const { mutate: login, isPending } = useLogin();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState<LoginReqDTO>({
        username: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);


    const handleLoginData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log('Updating login request:', { name, value });
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            setError('Please enter both username and password');
            return;
        }
        console.log('Logging in with:', form.username, form.password);

        try {
            console.log('Waiting for login function to complete...');
            setIsLoading(true);
            login(form, {
                onSuccess: (data) => {
                    console.log('Login successful:', data);
                    setIsLoading(false);
                    setError(null);
                    dispatch({ type: 'auth/setLoginDetails', payload: data });
                    onLoginSuccess();
                },
                onError: (loginErr) => {
                    console.error('Login failed:', loginErr);
                    setIsLoading(false);
                    setError(loginErr?.message || 'Login failed');
                }
            });
        } catch (err) {
            setError('Invalid credentials');
        }
    };


    return (
        <div className=" min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-custom-gradient">
            <div className=" max-w-screen-md w-full space-y-8 flex flex-row items-stretch justify-center">
                <div className=" text-center flex flex-col items-center justify-center py-8 px-4 sm:px-10">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                            <Database size={32} />
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-100">InvenTrack</h2>
                    <p className="mt-2 text-sm text-gray-300">
                        Sign in to your inventory management system
                    </p>
                </div>

                <div className=" mt-8 bg-slate-200 py-8 px-4 shadow sm:rounded-lg sm:px-10 opacity-100">
                    <form className=" max-w-xs space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <Input
                                label="Username"
                                id="username"
                                name="username"
                                type="text"
                                value={form.username}
                                onChange={handleLoginData}
                                required
                                fullWidth
                                placeholder="Enter your username"
                            />
                        </div>

                        <div className="relative">
                            <Input
                                label="Password"
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={handleLoginData}
                                required
                                fullWidth
                                placeholder="Enter your password"
                                helpText="(Hint: Use 'root/admin/user/monitor' with password 'password123 for demo.')"
                            />

                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500"
                                tabIndex={-1}
                            >
                                {showPassword ?
                                    <Eye
                                        color='#c0b9b9'
                                        size={16}
                                    /> :
                                    <EyeClosed
                                        color='#c0b9b9'
                                        size={16}
                                    />}
                            </button>
                        </div>


                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                fullWidth
                                isLoading={isLoading}
                                disabled={isPending}
                                size="lg"
                            >
                                {isPending ? 'Logging in...' : 'Login'}
                            </Button>
                            {/* {isError && <p style={{ color: 'red' }}>{loginErr?.message}</p>} */}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;