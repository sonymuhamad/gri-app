"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { TextInput, PasswordInput } from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";

import Login from "@/action/auth";
import { AuthSchema, AuthForm } from "@/schema/auth";

export default function LoginForm() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<AuthForm>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOnSubmit = async (data: AuthForm) => {
    const res = await Login(data);

    if (res) {
      return notifications.show({
        title: "Login Gagal",
        message: res.message,
        color: "red",
      });
    }

    router.replace("/admin");
    notifications.show({
      title: "Action Success",
      message: "Login Berhasil",
    });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Image
          className="w-12 h-12 mr-2"
          src="/logo-gri.png"
          alt="logo"
          width={48}
          height={48}
        />
        GRI Monitor
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleOnSubmit)}
            >
              <Controller
                render={({ field, fieldState: { error } }) => (
                  <TextInput
                    {...field}
                    label={"Email"}
                    placeholder={"Email"}
                    error={!!error}
                    description={error?.message}
                  />
                )}
                name={"email"}
                control={control}
              />
              <Controller
                render={({ field, fieldState: { error } }) => (
                  <PasswordInput
                    {...field}
                    label={"Password"}
                    placeholder={"Password"}
                    error={!!error}
                    description={error?.message}
                  />
                )}
                name={"password"}
                control={control}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
