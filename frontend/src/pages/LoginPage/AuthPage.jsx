


// import React, { useState } from 'react';
// import { Mail, Lock, User } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const birdImage = '/brain.png'; // Adjust path if needed

// // Reusable Input Component
// const AuthInput = ({ icon: Icon, type, placeholder, name, value, onChange }) => (
//   <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-400 transition duration-150">
//     <Icon className="absolute left-3 w-5 h-5 text-gray-400" />
//     <input
//       type={type}
//       placeholder={placeholder}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full pl-11 pr-4 py-3 text-gray-800 bg-transparent outline-none"
//       required
//     />
//   </div>
// );

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value.trim()
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const endpoint = isLogin
//       ? 'http://localhost:5000/api/auth/login'
//       : 'http://localhost:5000/api/auth/signup';

//     const payload = {
//       email: formData.email,
//       password: formData.password
//     };

//     if (!isLogin) {
//       payload.name = formData.name;
//     }

//     try {
//       const res = await fetch(endpoint, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.error || 'Something went wrong');
//         return;
//       }

//       if (isLogin) {
//         localStorage.setItem('token', data.token);
//       }

//       navigate('/HomePage');
//     } catch (err) {
//       console.error('Frontend error:', err);
//       alert('Server error. Please try again later.');
//     }
//   };

//   const title = isLogin ? 'Welcome Back to BetterX' : 'Join BetterX Today';
//   const callout = isLogin ? 'Your daily dose of calm awaits.' : 'Find your inner peace and track your mood.';
//   const buttonText = isLogin ? 'Login' : 'Create Account';

//   return (
//     <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB] font-sans p-4">
//       <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
//         <div className="flex items-center justify-center p-8 md:p-1">
//           <div className="w-full max-w-sm">
//             <div className="text-center mb-8">
//               <h1 className="text-5xl font-semibold text-[#000459] pb-4">{title}</h1>
//               <p className="text-lg text-gray-500 mb-10">{callout}</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {!isLogin && (
//                 <AuthInput
//                   icon={User}
//                   type="text"
//                   placeholder="Full Name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                 />
//               )}
//               <AuthInput
//                 icon={Mail}
//                 type="email"
//                 placeholder="Email Address"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//               <AuthInput
//                 icon={Lock}
//                 type="password"
//                 placeholder="Password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//               />

//               <button
//                 type="submit"
//                 className="w-full bg-[#65b0cf] text-white font-semibold py-3 rounded-lg hover:bg-[#51879e] transition duration-150 shadow-md mt-6"
//               >
//                 {buttonText}
//               </button>

//               {isLogin && (
//                 <div className="text-right text-sm text-gray-500">
//                   {/* Optional: Forgot Password link */}
//                 </div>
//               )}
//             </form>

//             <div className="mt-8 pt-4 border-t text-center text-gray-600">
//               <p>
//                 {isLogin ? "New to BetterX?" : "Already a member?"}
//                 <button
//                   type="button"
//                   onClick={() => setIsLogin(!isLogin)}
//                   className="ml-2 font-bold text-[#4e798a] hover:underline"
//                 >
//                   {isLogin ? 'Create an Account' : 'Login Here'}
//                 </button>
//               </p>
//             </div>
//           </div>
//         </div>

//         <div
//           className="relative hidden lg:flex items-end p-8 bg-cover bg-center"
//           style={{ backgroundImage: `url(${birdImage})` }}
//         >
//           {/* Optional overlay or branding */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;



// import React, { useState } from 'react';
// import { Mail, Lock, User } from 'lucide-react';

// const birdImage = '/brain.png'; // Adjust path if needed

// // Reusable Input Component
// const AuthInput = ({ icon: Icon, type, placeholder, name, value, onChange }) => (
//   <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-400 transition duration-150">
//     <Icon className="absolute left-3 w-5 h-5 text-gray-400" />
//     <input
//       type={type}
//       placeholder={placeholder}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full pl-11 pr-4 py-3 text-gray-800 bg-transparent outline-none"
//       required
//     />
//   </div>
// );

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

  // const handleChange = (e) => {
      //   setFormData({
      //     ...formData,
      //     [e.target.name]: e.target.value.trim()
      //   });
      //   setError(''); // Clear error on input change
      // };
    
    //   const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //       ...formData,
    //       [name]: name === 'password' ? value : value.trim() // Only trim email and name, not password
    //     });
    //     setError('');
    //   };
    
    //   const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError('');
    //     setSuccess('');
    
    //     const endpoint = isLogin
    //       ? 'http://localhost:5000/api/auth/login'
    //       : 'http://localhost:5000/api/auth/signup';
    
    //     const payload = {
    //       email: formData.email,
    //       password: formData.password
    //     };
    
    //     if (!isLogin) {
    //       payload.name = formData.name;
    //     }
    
    //     try {
    //       const res = await fetch(endpoint, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(payload)
    //       });
    
    //       const data = await res.json();
    
    //       if (!res.ok) {
    //         setError(data.error || 'Something went wrong');
    //         setLoading(false);
    //         return;
    //       }
    
    //       if (isLogin) {
    //         // ✅ Store auth data in React state instead of localStorage
    //         setSuccess('Login successful! Redirecting...');
    
    //         // Simulate navigation - in real app, use React Router with state
    //         setTimeout(() => {
    //           // You would do: navigate('/HomePage', { state: { token: data.token, user: data.user } });
    //           console.log('Token:', data.token);
    //           console.log('User:', data.user);
    //           alert(`Welcome back! Token: ${data.token.substring(0, 20)}...`);
    //           setLoading(false);
    //         }, 1500);
    //       } else {
    //         setSuccess('Signup successful! Please login.');
    //         setLoading(false);
    //         setTimeout(() => {
    //           setIsLogin(true);
    //           setFormData({ name: '', email: '', password: '' });
    //           setSuccess('');
    //         }, 2000);
    //       }
    //     } catch (err) {
    //       console.error('Frontend error:', err);
    //       setError('Server error. Please try again later.');
    //       setLoading(false);
    //     }
    //   };
    
    //   const title = isLogin ? 'Welcome Back to BetterX' : 'Join BetterX Today';
    //   const callout = isLogin ? 'Your daily dose of calm awaits.' : 'Find your inner peace and track your mood.';
    //   const buttonText = isLogin ? 'Login' : 'Create Account';
    
    //   return (
    //     <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB] font-sans p-4">
    //       <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
    //         <div className="flex items-center justify-center p-8 md:p-12">
    //           <div className="w-full max-w-sm">
    //             <div className="text-center mb-8">
    //               <h1 className="text-5xl font-semibold text-[#000459] pb-4">{title}</h1>
    //               <p className="text-lg text-gray-500 mb-10">{callout}</p>
    //             </div>
    
    //             {/* Error Message */}
    //             {error && (
    //               <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
    //                 {error}
    //               </div>
    //             )}
    
    //             {/* Success Message */}
    //             {success && (
    //               <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
    //                 {success}
    //               </div>
    //             )}
    
    //             <form onSubmit={handleSubmit} className="space-y-4">
    //               {!isLogin && (
    //                 <AuthInput
    //                   icon={User}
    //                   type="text"
    //                   placeholder="Full Name"
    //                   name="name"
    //                   value={formData.name}
    //                   onChange={handleChange}
    //                 />
    //               )}
    //               <AuthInput
    //                 icon={Mail}
    //                 type="email"
    //                 placeholder="Email Address"
    //                 name="email"
    //                 value={formData.email}
    //                 onChange={handleChange}
    //               />
    //               <AuthInput
    //                 icon={Lock}
    //                 type="password"
    //                 placeholder="Password"
    //                 name="password"
    //                 value={formData.password}
    //                 onChange={handleChange}
    //               />
    
    //               <button
    //                 type="submit"
    //                 disabled={loading}
    //                 className={`w-full bg-[#65b0cf] text-white font-semibold py-3 rounded-lg hover:bg-[#51879e] transition duration-150 shadow-md mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''
    //                   }`}
    //               >
    //                 {loading ? 'Processing...' : buttonText}
    //               </button>
    
    //               {isLogin && (
    //                 <div className="text-right text-sm text-gray-500">
    //                   {/* Optional: Forgot Password link */}
    //                 </div>
    //               )}
    //             </form>
    
    //             <div className="mt-8 pt-4 border-t text-center text-gray-600">
    //               <p>
    //                 {isLogin ? "New to BetterX?" : "Already a member?"}
    //                 <button
    //                   type="button"
    //                   onClick={() => {
    //                     setIsLogin(!isLogin);
    //                     setError('');
    //                     setSuccess('');
    //                     setFormData({ name: '', email: '', password: '' });
    //                   }}
    //                   className="ml-2 font-bold text-[#4e798a] hover:underline"
    //                   disabled={loading}
    //                 >
    //                   {isLogin ? 'Create an Account' : 'Login Here'}
    //                 </button>
    //               </p>
    //             </div>
    //           </div>
    //         </div>
    
    //         <div
    //           className="relative hidden lg:flex items-end p-8 bg-cover bg-center"
    //           style={{ backgroundImage: `url(${birdImage})` }}
    //         >
    //           {/* Optional overlay or branding */}
    //         </div>
    //       </div>
    //     </div>
    //   );
    // };
    
    // export default AuthPage;
    
    
    
    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Mail, Lock, User } from 'lucide-react';
    
    const birdImage = '/brain.png';
    
    // Reusable Input Component
    const AuthInput = ({ icon: Icon, type, placeholder, name, value, onChange }) => (
      <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-400 transition duration-150">
        <Icon className="absolute left-3 w-5 h-5 text-gray-400" />
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-11 pr-4 py-3 text-gray-800 bg-transparent outline-none"
          required
        />
      </div>
    );
    
    const AuthPage = ({ onAuthSuccess }) => {
      const navigate = useNavigate();
      const [isLogin, setIsLogin] = useState(true);
      const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
      });
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: name === 'password' ? value : value.trim() // Don't trim passwords
        });
        setError('');
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
    
        const endpoint = isLogin
          ? 'http://localhost:5050/api/auth/login'
          : 'http://localhost:5050/api/auth/signup';
    
        const payload = {
          email: formData.email,
          password: formData.password
        };
    
        if (!isLogin) {
          payload.name = formData.name;
        }
    
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
    
          const data = await res.json();
    
          if (!res.ok) {
            setError(data.error || 'Something went wrong');
            setLoading(false);
            return;
          }
    
          if (isLogin) {
            // ✅ Login successful
            setSuccess('Login successful! Redirecting...');
    
            // 🔹 Store access and refresh tokens in localStorage
            const accessToken = data.accessToken || data.token;
            if (accessToken) {
              localStorage.setItem('accessToken', accessToken);
              // legacy alias for components that still read `token`
              localStorage.setItem('token', accessToken);
            }
            if (data.refreshToken) {
              localStorage.setItem('refreshToken', data.refreshToken);
            }
    
            // Call parent function if needed (pass the current access token)
            if (onAuthSuccess) {
              onAuthSuccess(accessToken, data.user);
            }
    
            // Navigate based on role
            setTimeout(() => {
              if (data.user.role === 'counsellor') {
                navigate('/AdminDashboard');
              } else {
                navigate('/HomePage');
              }
            }, 1500);
          } else {
            // ✅ Signup successful
            setSuccess('Signup successful! Please login.');
            setLoading(false);
            setTimeout(() => {
              setIsLogin(true);
              setFormData({ name: '', email: '', password: '' });
              setSuccess('');
            }, 2000);
          }
        } catch (err) {
          console.error('Frontend error:', err);
          setError('Server error. Please try again later.');
          setLoading(false);
        }
      };
    
      const title = isLogin ? 'Welcome Back to BetterX' : 'Join BetterX Today';
      const callout = isLogin ? 'Your daily dose of calm awaits.' : 'Find your inner peace and track your mood.';
      const buttonText = isLogin ? 'Login' : 'Create Account';
    
      return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB] font-sans p-4">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="flex items-center justify-center p-8 md:p-12">
              <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                  <h1 className="text-5xl font-semibold text-[#000459] pb-4">{title}</h1>
                  <p className="text-lg text-gray-500 mb-10">{callout}</p>
                </div>
    
                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
    
                {/* Success Message */}
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {success}
                  </div>
                )}
    
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <AuthInput
                      icon={User}
                      type="text"
                      placeholder="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  )}
                  <AuthInput
                    icon={Mail}
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <AuthInput
                    icon={Lock}
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
    
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-[#65b0cf] text-white font-semibold py-3 rounded-lg hover:bg-[#51879e] transition duration-150 shadow-md mt-6 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Processing...' : buttonText}
                  </button>
                </form>
    
                <div className="mt-8 pt-4 border-t text-center text-gray-600">
                  <p>
                    {isLogin ? "New to BetterX?" : "Already a member?"}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setSuccess('');
                        setFormData({ name: '', email: '', password: '' });
                      }}
                      className="ml-2 font-bold text-[#4e798a] hover:underline"
                      disabled={loading}
                    >
                      {isLogin ? 'Create an Account' : 'Login Here'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
    
            <div
              className="relative hidden lg:flex items-end p-8 bg-cover bg-center"
              style={{ backgroundImage: `url(${birdImage})` }}
            >
            </div>
          </div>
        </div>
      );
    };
    
    export default AuthPage;