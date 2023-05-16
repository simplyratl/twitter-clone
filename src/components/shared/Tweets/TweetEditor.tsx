import React, { useEffect, useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import ProfileImage from "~/components/shared/ProfileImage";

type Mention = {
  id: string;
  name: string;
  type: "user" | "hashtag";
};

const mentionSuggestions = [
  { id: "1", name: "John", type: "user" },
  { id: "2", name: "Jane", type: "user" },
  { id: "3", name: "React", type: "hashtag" },
  { id: "4", name: "TypeScript", type: "hashtag" },
];

const TweetEditor = () => {
  const [code, setCode] = React.useState(`const variable = 5;`);
  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
  };

  const highlightCode = (code: string) => {
    const regex = /const|let|var|\b\w+\b|[0-9]+/g; // Define a regex pattern for syntax highlighting
    const matches = code.match(regex); // Find all matches in the code string

    return (
      <>
        {matches.map((match, index) => (
          <span
            key={index}
            style={{
              color: /^[0-9]+$/.test(match)
                ? "white"
                : /^[a-zA-Z]+$/.test(match)
                ? "blue"
                : "inherit",
            }} // Customize the color based on the match type
          >
            {match}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="relative">
      <div>
        <textarea
          value={code}
          onChange={handleCodeChange}
          style={{ width: "100%", height: "400px" }}
        />
        <div
          style={{
            backgroundColor: "#282c34",
            padding: "1rem",
            fontSize: "1.2rem",
          }}
        >
          {highlightCode(code)}
        </div>
      </div>

      {/*<ContentEditable*/}
      {/*  html={html}*/}
      {/*  onChange={handleChange}*/}
      {/*  tagName="div"*/}
      {/*  // onKeyDown={handleMentionSearch}*/}
      {/*  className="h-full w-full resize-none bg-transparent text-xl text-black placeholder-neutral-500 outline-none dark:text-white"*/}
      {/*  placeholder="What is happening?!"*/}
      {/*/>*/}
      {/*{mentionSuggestionsVisible && (*/}
      {/*  <div className="absolute -bottom-[190px] left-0 z-40 w-[400px] overflow-hidden rounded-lg bg-white dark:bg-black">*/}
      {/*    <ul>*/}
      {/*      {filtered.map((mention, index: number) => (*/}
      {/*        <li*/}
      {/*          key={mention.id}*/}
      {/*          onClick={() => handleMentionSuggestionSelect(mention)}*/}
      {/*          className={`${*/}
      {/*            index === selectedItem ? "bg-red-500" : ""*/}
      {/*          } cursor-pointer p-4 hover:bg-neutral-800`}*/}
      {/*        >*/}
      {/*          <div className="flex gap-3">*/}
      {/*            <ProfileImage*/}
      {/*              src={*/}
      {/*                "https://pbs.twimg.com/media/FwKlCFoWIAMWn24?format=jpg&name=large"*/}
      {/*              }*/}
      {/*              size={14}*/}
      {/*            />*/}
      {/*            <div>*/}
      {/*              <span className="text-lg text-black dark:text-white">*/}
      {/*                {mention.name}*/}
      {/*              </span>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        </li>*/}
      {/*      ))}*/}
      {/*    </ul>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};

export default TweetEditor;
