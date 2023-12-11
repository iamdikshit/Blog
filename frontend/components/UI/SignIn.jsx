"use client";
import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
const SignIn = () => {
  return (
    <div className="Form-signIn shadow-lg w-full sm:max-w-md m-2 px-4 py-6">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-8">
        Sign in
      </h1>
      <div>
        <Formik
          initialValues={{ name: "", email: "", password: "", confirmPass: "" }}
          validationSchema={Yup.object({
            name: Yup.string().required("Name can not be empty!"),
            email: Yup.string()
              .email("Invalid Email")
              .required("Email can not be empty"),
            password: Yup.string().required("Password Cannot be empty"),
            confirmPass: Yup.string()
              .required("Confirm Password cannot be empty")
              .oneOf([Yup.ref("password")], "Passwords must match"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            setSubmitting(false);
          }}
        >
          {
            /// Formik will take callback function and it will return form
            ({ isSubmitting }) => (
              <Form>
                <div className="flex flex-col gap-8">
                  <div>
                    <Field
                      className="text-gray-900 text-base p-2 w-full bg-gray-100 outline-none rounded-sm"
                      type="email"
                      name="email"
                      placeholder="example@mail.com"
                    />
                    <ErrorMessage
                      className="text-sm text-red-600 mt-2"
                      name="email"
                      component="div"
                    />
                  </div>

                  <div>
                    <Field
                      className="text-gray-900 text-base p-2 w-full bg-gray-100 outline-none rounded-sm"
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                    <ErrorMessage
                      className="text-sm text-red-600 mt-2"
                      name="password"
                      component="div"
                    />
                  </div>
                </div>

                <button
                  className="p-2 bg-blue-600 mt-8 w-full text-white "
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </button>

                <div className="mt-4">
                  <Link href={"/"} className="text-base text-blue-600">
                    Forgot Password?
                  </Link>
                </div>
              </Form>
            )
          }
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
