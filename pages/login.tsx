import axios from "axios";
import Head from "next/head";
import { FormEventHandler, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Link from "../components/Link";
import styles from "../styles/Home.module.css";

export default function Login() {
  const loginRequest = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    return await axios.post("/api/login", { email, password });
  };

  let login = useMutation(loginRequest);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    login.mutate({ email, password });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Account dashboard</title>
        <meta name="description" content="Account dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {login.isSuccess && <h1>Check if user has connected bank</h1>}

      <main className={styles.main}>
        <form className="flex flex-col" onSubmit={submitHandler}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
          <button type="submit">Login</button>
        </form>
      </main>
    </div>
  );
}
