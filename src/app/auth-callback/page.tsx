"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getAuthStatus } from "./actions"; // Импортируй функцию из файла

const Page = () => {
  const [configId, setConfigId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const configurationId = localStorage.getItem("configurationId");
    if (configurationId) setConfigId(configurationId);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth-callback"],
    queryFn: getAuthStatus, // Здесь вызываем серверную функцию напрямую
    retry: true,
    retryDelay: 500,
  });

  useEffect(() => {
    if (data?.success) {
      if (configId) {
        localStorage.removeItem("configurationId");
        router.push(`/configure/preview?id=${configId}`);
      } else {
        router.push("/");
      }
    }
  }, [data, configId, router]);

  if (isLoading) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Logging you in...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <h3 className="font-semibold text-xl">Error logging in</h3>
          <p>There was a problem with the login process. Please try again.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default Page;
