import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import CodeDisplay from "~/components/codedisplay";
import InputDisplay from "~/components/inputdisplay";
import { api } from "~/utils/api";

export default function Test() {
  const { isSignedIn } = useUser();
  const { data: codeBlock, isLoading } = api.codes.getCodes.useQuery();

  if (isLoading) return <div />;

  return (
    <PageLayout>
      {!!isSignedIn &&
        <>
          <div className="relative flex flex-wrap bg-slate-900 w-[64rem] h-[40rem] shadow-xl rounded-xl">
            <div
              key="text_prompt_display"
              id="text_display"
              className="text_display flex flex-col w-1/2 text-white
              text-2xl px-12 py-12 tracking-tight font-extralight
              font-mono">
              <CodeDisplay codeBlock={codeBlock!} />
              <div className="my-24 whitespace-pre-wrap">
                NOTE:
                Press "ENTER" after the last line to complete.
              </div>
            </div>
            <InputDisplay />
          </div>
          <div className="flex w-full h-16 bg-slate-800 rounded-full shadow-xl items-center px-12">
            <Link href="/" className="bg-orange-400 px-10 py-2 rounded-full">Home</Link>
          </div>
        </>
      }
      </PageLayout>
  );
}

