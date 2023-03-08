import axios, { AxiosResponse } from "axios";
import Head from "next/head";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
} from "react-plaid-link";
import { useMutation, useQuery, UseMutationResult } from "react-query";
import Link from "../components/Link";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [success, setSuccess] = useState(false);

  const generateToken = async (userID: string) => {
    return await axios.post("/api/create-link-token", { userID });
  };

  const createLinkToken = useMutation(generateToken);

  useEffect(() => {
    createLinkToken.mutate("63fcdc233a0c88ca0944c128");
  }, []);

  const getSuccess = (value: boolean) => {
    return setSuccess(value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Account dashboard</title>
        <meta name="description" content="Account dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className="text-lg font-bold">Connect bank account page</h1>
        {createLinkToken.isSuccess && (
          <Link
            linkToken={createLinkToken.data.data.link_token}
            getSuccess={getSuccess}
          />
        )}
        {createLinkToken.isLoading && (
          <h1 className="text-lg font-bold">Loading...</h1>
        )}
        {success && <h1 className="text-lg font-bold">Success!</h1>}
      </main>
    </div>
  );
}
