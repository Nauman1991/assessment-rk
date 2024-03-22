'use client';
import { clear } from 'console';
import { useEffect, useState, useRef } from 'react';
import Image, { ImageProps } from 'next/image';
import axios from 'axios';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

export default function Dashboard() {
  const [formData, setFormData]: any[] = useState([]);
  const [notifications, setNotifications]: any[] = useState([]);
  const [showMenuItem, setShowMenuItem] = useState(false);

  const nameRef = useRef();
  const [image, setImage] = useState({
    preview: '',
    raw: '',
  });

  let classMenuDependsOnCondtion = showMenuItem ? '' : 'hidden';

  useEffect(() => {
    //Get Value
    let getUser = JSON.parse(localStorage.getItem('user'));

    if (getUser['avatar'] != null) {
      image.preview = 'http://localhost:3001' + getUser['avatar'];
    }

    setFormData(getUser);

    const socket = io('http://localhost:3001');
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('notification', (data) => {
      setNotifications([...notifications, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [notifications]);

  const updateImage = async (e: any) => {
    try {
      if (e.target.files.length) {
        setImage({
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0],
        });
      }

      let accessToken = formData['accessToken'];
      const file = e.target.files[0];

      const fd = new FormData();
      fd.append('image', file);

      axios
        .post(`http://localhost:3001/api/users/uploadImage`, fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + accessToken,
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
            //Update local storage
            formData.avatar = response.data.data;
            localStorage.setItem('user', JSON.stringify(formData));

            //Update image state
            image.preview = response.data.data;

            toast.success(response.data.message, {
              position: 'top-right',
            });
          }
        })
        .catch((error) => {
          // Handle error
          console.error('Error:', error);
        });
    } catch (error) {
      console.error('Error enhancing image:', error);
    }
  };

  const updateUser = async () => {
    try {
      axios
        .post(
          `http://localhost:3001/api/users/update`,
          {
            data: {
              email: formData['email'],
              name: formData['name'],
            },
          },
          {
            headers: {
              Authorization: 'Bearer ' + formData['accessToken'],
            },
          }
        )
        .then((response) => {
          // Handle success
          console.log('Response:', response.data);
          if (response.data.success == false) {
            toast.error(response.data.message, {
              position: 'top-right',
            });
          } else {
            toast.success(response.data.message, {
              position: 'top-right',
            });

            formData.email = formData['email'];
            formData.name = formData['name'];
            localStorage.setItem('user', JSON.stringify(formData));
          }
        })
        .catch((error) => {
          // Handle error
          console.error('Error:', error);
        });
    } catch (error) {}
  };

  const showMenu = async () => {
    let menuItem = showMenuItem;
    menuItem = !menuItem;
    setShowMenuItem(menuItem);
  };

  return (
    <>
      <div className="relative font-[sans-serif] w-max mx-auto py-8 ">
        <button
          type="button"
          className="w-12 h-12 flex items-center justify-center rounded-full text-white text-sm font-semibold border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
          onClick={showMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            className="cursor-pointer fill-[#fff]"
            viewBox="0 0 371.263 371.263"
          >
            <path
              d="M305.402 234.794v-70.54c0-52.396-33.533-98.085-79.702-115.151.539-2.695.838-5.449.838-8.204C226.539 18.324 208.215 0 185.64 0s-40.899 18.324-40.899 40.899c0 2.695.299 5.389.778 7.964-15.868 5.629-30.539 14.551-43.054 26.647-23.593 22.755-36.587 53.354-36.587 86.169v73.115c0 2.575-2.096 4.731-4.731 4.731-22.096 0-40.959 16.647-42.995 37.845-1.138 11.797 2.755 23.533 10.719 32.276 7.904 8.683 19.222 13.713 31.018 13.713h72.217c2.994 26.887 25.869 47.905 53.534 47.905s50.54-21.018 53.534-47.905h72.217c11.797 0 23.114-5.03 31.018-13.713 7.904-8.743 11.797-20.479 10.719-32.276-2.036-21.198-20.958-37.845-42.995-37.845a4.704 4.704 0 0 1-4.731-4.731zM185.64 23.952c9.341 0 16.946 7.605 16.946 16.946 0 .778-.12 1.497-.24 2.275-4.072-.599-8.204-1.018-12.336-1.138-7.126-.24-14.132.24-21.078 1.198-.12-.778-.24-1.497-.24-2.275.002-9.401 7.607-17.006 16.948-17.006zm0 323.358c-14.431 0-26.527-10.3-29.342-23.952h58.683c-2.813 13.653-14.909 23.952-29.341 23.952zm143.655-67.665c.479 5.15-1.138 10.12-4.551 13.892-3.533 3.773-8.204 5.868-13.353 5.868H59.89c-5.15 0-9.82-2.096-13.294-5.868-3.473-3.772-5.09-8.743-4.611-13.892.838-9.042 9.282-16.168 19.162-16.168 15.809 0 28.683-12.874 28.683-28.683v-73.115c0-26.228 10.419-50.719 29.282-68.923 18.024-17.425 41.498-26.887 66.528-26.887 1.198 0 2.335 0 3.533.06 50.839 1.796 92.277 45.929 92.277 98.325v70.54c0 15.809 12.874 28.683 28.683 28.683 9.88 0 18.264 7.126 19.162 16.168z"
              data-original="#000000"
            ></path>
          </svg>
        </button>

        <div
          className={`${classMenuDependsOnCondtion} absolute shadow-lg  bg-white py-2 z-[1000] min-w-full rounded-lg w-[410px] max-h-[500px] overflow-auto`}
        >
          <ul className="divide-y">
            {notifications.map((notification: any, index: any) => (
              // <li key={index}>{notification.message}</li>
              <li
                className="py-4 px-4 flex items-center hover:bg-gray-50 text-black text-sm cursor-pointer"
                key={index}
              >
                <img
                  src="https://readymadeui.com/profile_2.webp"
                  className="w-12 h-12 rounded-full shrink-0"
                />
                <div className="ml-6">
                  <h3 className="text-sm text-[#333] font-semibold">
                    {notification.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-blue-500 leading-3 mt-2">
                    {notification.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="h-screen py-5 px-3  items-center">
        <div className="bg-white">
          <h4 className="flex justify-center p-3 text-[22px]">
            <Image
              className="inline-block size-[62px] rounded-full ring-2 ring-white dark:ring-gray-800"
              src={image.preview}
              alt="Image Description"
              width={10}
              height={20}
            />
          </h4>

          <div className="md:grid grid-cols-12 flex flex-col md:items-center gap-4 p-4">
            <div className="col-span-6 relative">
              <span className="absolute bg-white left-3 -top-[12px] px-2">
                Name
              </span>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className="text-[13px] h-12 text-gray-700 w-full border-2 px-2 rounded-sm"
                defaultValue={formData['name']}
                onChange={(e) => (formData['name'] = e.target.value)}
              />
            </div>

            <div className="col-span-6 relative">
              <span className="absolute bg-white left-3 -top-[12px] px-2">
                Email
              </span>
              <input
                type="text"
                placeholder="test@gmail.com"
                className="text-[13px] h-12 text-gray-700 w-full border-2 px-2 rounded-sm"
                defaultValue={formData['email']}
                onChange={(e) => (formData['email'] = e.target.value)}
              />
            </div>
          </div>

          <div className="p-2 flex">
            <div className="w-1/2"></div>
            <div className="w-1/2 flex justify-end">
              <input
                type="file"
                name="imageUpload"
                id="imageUpload"
                className="hidden"
                onChange={updateImage}
              />
              <label
                htmlFor="imageUpload"
                className="bg-gray-500 text-white p-2 rounded text-sm w-auto cursor-pointer"
              >
                Upload image
              </label>
              <button
                type="submit"
                className="bg-green-600 text-white p-2 ml-6 rounded text-lg w-auto"
                onClick={updateUser}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
