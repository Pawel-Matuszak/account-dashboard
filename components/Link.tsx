import axios from "axios";
import React from "react";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { useMutation } from "react-query";

interface LinkProps {
  linkToken: string | null;
  getSuccess: (value: boolean) => void;
}
const Link: React.FC<LinkProps> = (props: LinkProps) => {
  const setAccessToken = useMutation(
    (public_token: any) => {
      return axios.post("/api/set-access-token", {
        public_token,
        userID: "63fcdc233a0c88ca0944c128",
      });
    },
    {
      onSuccess: ({ data }) => {
        if (data.public_token_exchange === "complete") props.getSuccess(true);
      },
      onError: (err) => console.log(err),
    }
  );

  const config: PlaidLinkOptions = {
    token: props.linkToken!,
    // receivedRedirectUri: null,
    onSuccess: (public_token: any, metadata: any) => {
      setAccessToken.mutate(public_token);
    },
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <button onClick={() => open()} disabled={!ready}>
      Link account
    </button>
  );
};

export default Link;
