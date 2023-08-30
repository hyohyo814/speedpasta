import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";
import { useState } from "react";

function TestCode() {
  const codeSample1 = [
    "function sum(a: number, b: number )",
    "{",
    "return a + b",
    "}",
    "var total: number = sum(10,20);",
    "var str: string = sum(10,20);"
  ]
  const codeParse: string[][] = [];
  
  // string for code sample
  for (const line of codeSample1) {
    const split = line.split("");
    codeParse.push(split);
  }

  let group = 0;
  let divGroup: React.JSX.Element[] = [];
  let lineGroup: React.JSX.Element[] = [];
  const htmlTransform: React.JSX.Element[] = [];

  codeParse.forEach((spread, line) => {
    let strCount = 0;
    spread.forEach((el, idx) => {
      switch(true) {
        case el === " ":
          lineGroup.push(<div key={`line${line}/group${group}`} id={`line${line}/group${group}`} className="mr-2">{divGroup}</div>);
          divGroup = [];
          group++;
          strCount = 0;
          break;
        case /\(|\)/g.test(el):
          lineGroup.push(<div key={`line${line}/group${group}`} id={`line${line}/group${group}`} className="">{divGroup}</div>);
          divGroup = [];
          group++;
          strCount = 0;
          if (/\(/g.test(el)) {
            divGroup.push(<span key={`line${line}/group${group}/char${strCount}`} id={`line${line}/group${group}/char${strCount}`}>{el}</span>); 
            lineGroup.push(<div key={`line${line}/group${group}`} id={`line${line}/group${group}`} className="">{divGroup}</div>);
            divGroup = [];
            group++;
          } else if (/\)/g.test(el)) {
            divGroup.push(<span key={`line${line}/group${group}/char${strCount}`} id={`line${line}/group${group}/char${strCount}`}>{el}</span>); 
            lineGroup.push(<div key={`line${line}/group${group}`} id={`line${line}/group${group}`} className="">{divGroup}</div>);
            divGroup = [];
            group++;
          }
          break;
        default:
          divGroup.push(<span key={`line${line}/group${group}/char${strCount}`} id={`line${line}/group${group}/char${strCount}`}>{el}</span>);
          strCount++;
          if (idx === spread.length - 1) {
            lineGroup.push(<div key={`line${line}/group${group}`} id={`line${line}/group${group}`}>{divGroup}</div>);
            divGroup = [];
            group = 0;
          }
          break;
      }

    })
     
    htmlTransform.push(<div key={`line${line}`} id={`line${line}`} className="w-full flex">{lineGroup}</div>)
    lineGroup = [];
    group = 0;
  })

  return htmlTransform;
}

function TestMap() {
  // string for simple text
  const test = "Did you know that the critically acclaimed MMORPG Final Fantasy XIV has a free trial, and includes the entirety of A Realm Reborn AND the award-winning Heavensward and Stormblood expansions up to level 70 with n restrictions on playtime? Sign up, and enjoy Eorzea today!"
  const testArr = test.split("");
  let group = 0;
  let divGroup: React.JSX.Element[] = [];
  const result: React.JSX.Element[] = [];
  testArr.forEach((el, idx) => {
    if (el === " ") {
      result.push(<div key={`group_display/${group}`} id={`word_group/${group}`} className="">{divGroup}</div>);
      group++;
      divGroup = [];
    } else {
      divGroup.push(<span id={`group/${group}`} key={`display/${idx}`} className="display_char font-mono">{el}</span>);
    }
  });

  return result;
}


export default function Home() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [outputArr, setOutputArr] = useState<React.JSX.Element[]>([]);

  interface WordChunk {
    [key: string]: string[] 
  }

  function typingHandle(e: React.SyntheticEvent) {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const inputSplit = target.value.split("");
    let inputGroup = 0;
    let strCount = 0;
    let extraCount = 0;
    const wordGroup: WordChunk = {};
    const result: React.JSX.Element[] = [];

    inputSplit.forEach((el, idx) => {
      if (!wordGroup[inputGroup]) {
        wordGroup[inputGroup] = [];
      }

      let displayChars = document.querySelectorAll(`[id='group/${inputGroup}']`);
      const focus = displayChars[strCount] as HTMLSpanElement;

      switch(true) {
        case el === " ":
          if (strCount !== 0) {
            inputGroup++;
            strCount = 0;
            extraCount = 0;
            result.push(<span key={idx} className="m-1">{el}</span>);
            break;
          } else {
            break;
          }
        case el === focus?.innerText:
          result.push(<span key={idx} className="text-green-500">{el}</span>);
          wordGroup[inputGroup]!.push(el);
          strCount++;
          break;
        case el !==focus?.innerText:
          result.push(<span key={idx} className="text-rose-500">{el}</span>);
          wordGroup[inputGroup]!.push(el);
          strCount++;
          break;
        default:
          break;
      }
    })
      
    setOutputArr(result);
  }

  return (
    <PageLayout>
      {!isSignedIn &&
        <>
          <h1 className="front_title text-5xl font-semibold tracking-tight text-white sm:text-[5rem]">
            Speed<span className="text-rose-600">pasta</span>
          </h1>
          <div className="get_started flex flex-col gap-12 text-white text-3xl font-light items-center">
            <p>Test out your ability to churn out copypastas</p>
            <SignInButton>
              <button className="get_started w-64 h-28 bg-rose-500 rounded-3xl">Get Started</button>
            </SignInButton>
          </div>
        </>}
      {!!isSignedIn &&
        <>
          <div className="flex flex-col bg-slate-900 w-[64rem] h-[40rem]">
            <input
              id="input_display"
              className="w-full text-white break-normal text-4xl bg-slate-800 z-50 px-12 p-1
              font-light tracking-tight"
              onChange={typingHandle}
            />
            <div id="text_display" className="text_display flex flex-wrap w-full text-white
              break-normal text-2xl px-12 py-2 tracking-tight font-extralight
              ">
              <TestCode />
            </div>
            <div id="text_display" className="text_display flex flex-wrap w-full text-white
              break-normal text-4xl px-12 py-2 tracking-tight font-light
              ">
              {outputArr}
            </div>
          </div>
        </>
      }
    </PageLayout>
  );
}
