import axios from "axios";
import React from "react";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { useMutation, UseMutationResult } from "react-query";

interface LinkProps {
  linkToken: string | null;
  setAccessToken: UseMutationResult;
}

const Link: React.FC<LinkProps> = (props: LinkProps) => {
  const config: PlaidLinkOptions = {
    token: props.linkToken!,
    // receivedRedirectUri: null,
    onSuccess: (public_token: any, metadata: any) => {
      props.setAccessToken.mutate(public_token);
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
