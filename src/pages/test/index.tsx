import Link from "next/link";
import { PageLayout } from "~/components/layout";
import CodeDisplay from "~/components/codedisplay";
import InputDisplay from "~/components/inputdisplay";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function Test() {
  const { data: codeBlock, isLoading } = api.codes.getCodes.useQuery();
  const { isSignedIn } = useUser();
  const [userRecord, setUserRecord] = useState<number>(0);
  const router = useRouter();
  const { mutate } = api.users.saveData.useMutation({
    onSuccess: () => {
      router.reload();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        console.error(errorMessage);
      } else {
        console.error("error saving data");
      }
    },
  })

  function saveHandle(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!!userRecord && !!codeBlock?.id) {
      mutate({ time: userRecord, code: codeBlock.id });
    } else {
      console.error("failed to save data");
    }
  }

  function handleReload() {
    router.reload();
  }


  return (
    <PageLayout>
      <div className="relative flex flex-wrap
      bg-slate-900 w-[64rem] h-[40rem]
      shadow-xl rounded-xl">
        {!!isLoading && <div
          id="display_loading"
          className="flex w-1/2 px-12 py-12
          bg-gradient-to-r from-orange-500 to-lime-50
          text-3xl text-transparent bg-clip-text
          justify-center items-center animate-pulse">
          <span>Loading...</span>
        </div>}
        {!isLoading && <div
          key="text_prompt_display"
          id="text_display"
          className="text_display flex flex-col w-1/2
          text-white text-2xl px-12 py-6 tracking-tight
          font-extralight font-mono">
          {!!codeBlock?.data && <CodeDisplay codeBlock={codeBlock.data} />}
          <span className="mt-20 text-lg font-sans
          font-light whitespace-pre-wrap text-orange-500">
            NOTE:
            Press ENTER after the last line to complete.
          </span>
        </div>}
        <InputDisplay userRecord={userRecord} setUserRecord={setUserRecord} />
      </div>
      <div className="flex flex-grow h-16 bg-slate-800
      rounded-full shadow-xl items-center px-12 gap-x-4
      justify-center">
        <Link href="/" className="bg-orange-400 px-10
        py-2 rounded-full">
          Home
        </Link>
        <button
        onClick={handleReload}
        className="bg-orange-400 px-10 py-2 rounded-full">
          Reload
        </button>
        {isSignedIn && <>
          <button
          onClick={saveHandle}
          className="bg-rose-400 px-6 py-2 rounded-full">
            Save Record: {userRecord === 0 ? "awaiting" : `${userRecord} s`}
          </button>
        </>}
        {!!isSignedIn && <Link href="/profile" className="bg-orange-400 px-10
        py-2 rounded-full">
          Profile 
        </Link>}
        {!!isSignedIn && <SignOutButton>
          <button className="bg-orange-400 px-10 py-2 rounded-full">
            Sign Out
          </button>
        </SignOutButton>}
      </div>
    </PageLayout>
  );
}

