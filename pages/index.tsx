import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Link from "../components/Link";
import styles from "../styles/Home.module.css";

export default function Home() {
  const createTokenRequest = async (userID: string) => {
    return await axios.post("/api/create-link-token", { userID });
  };

  const setTokenRequest = async (public_token: any) => {
    return axios.post("/api/set-access-token", {
      public_token,
      userID: "63fcdc233a0c88ca0944c128",
    });
  };

  //todo: get userID from session
  var userID = "63fcdc233a0c88ca0944c128";

  const getAccessToken = useQuery(["getToken", userID], async () => {
    return axios.get("/api/access-token", { params: { userID } });
  });
  const createLinkToken = useMutation(createTokenRequest);
  const setAccessToken = useMutation(setTokenRequest);

  const getAccounts = useQuery(
    ["accounts", getAccessToken?.data?.data.access_token],
    async () => {
      return await axios.get(`/api/accounts/`, {
        params: { access_token: getAccessToken?.data?.data.access_token },
      });
    },
    {
      enabled: !!getAccessToken?.data?.data.access_token,
    }
  );

  useEffect(() => {
    createLinkToken.mutate("63fcdc233a0c88ca0944c128");
  }, []);

  useEffect(() => {
    if (getAccounts.isSuccess) {
      console.log(getAccounts.data.data);
    }
  }, [getAccounts.isSuccess]);

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
            setAccessToken={setAccessToken}
          />
        )}
        {setAccessToken.isSuccess && (
          <h1 className="text-lg font-bold">Success!</h1>
        )}
        {(createLinkToken.isLoading || setAccessToken.isLoading) && (
          <h1 className="text-lg font-bold">Loading...</h1>
        )}
      </main>
    </div>
  );
}
