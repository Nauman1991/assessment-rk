'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [formData, setFormData]: any[] = useState([]);
  const { push } = useRouter();

  const handleValidation = (e: any, index: any) => {
    formData[index] = e.target.value;
    setFormData(formData);
  };

  const userRegister = () => {
    if (formData['name'].length <= 0) {
      toast.error('Name is required!', {
        position: 'top-right',
      });
      return;
    }

    if (formData['email'].length <= 0) {
      toast.error('Email is required!', {
        position: 'top-right',
      });
      return;
    }

    if (formData['password'].length <= 0) {
      toast.error('Password is required!', {
        position: 'top-right',
      });
      return;
    }

    if (formData['password'] != formData['retypePassword']) {
      toast.error('Password does not match, please check your password!', {
        position: 'top-right',
      });
      return;
    }

    axios
      .post(`http://localhost:3001/api/users/signup`, {
        data: {
          name: formData['name'],
          email: formData['email'],
          password: formData['password'],
          retypePassword: formData['retypePassword'],
        },
      })
      .then((response) => {
        // Handle success
        console.log('Response:', response.data);
        if (response.data.success == false) {
          toast.error(response.data.message, {
            position: 'top-right',
          });
        } else {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          push(`/${response.data.redirect}`);
        }
      })
      .catch((error) => {
        // Handle error
        console.error('Error:', error);
      });

    return;
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign up for your account
              </h1>
              {/* <form className="space-y-4 md:space-y-6" action="#"> */}

              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="John Doe"
                  onChange={(e) => {
                    handleValidation(e, 'name');
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  onChange={(e) => {
                    handleValidation(e, 'email');
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => {
                    handleValidation(e, 'password');
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="retype-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Retype Password
                </label>
                <input
                  type="password"
                  name="retype-password"
                  id="retype-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => {
                    handleValidation(e, 'retypePassword');
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 bg-sky-500/75 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={userRegister}
              >
                Sign up
              </button>
              {/* </form> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
