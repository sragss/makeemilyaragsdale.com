"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { cn } from "@/lib/utils";

type SourcePart = Extract<
  UIMessage["parts"][number],
  { type: "source-url" | "source-document" }
>;

function sourceLabel(part: SourcePart) {
  if (part.type === "source-document") {
    return part.title ?? "Document";
  }

  if (part.title) {
    return part.title;
  }

  try {
    return new URL(part.url).hostname.replace(/^www\./, "");
  } catch {
    return part.url;
  }
}

function MessageSources({ message }: { message: UIMessage }) {
  const sources = message.parts.filter(
    (part): part is SourcePart =>
      part.type === "source-url" || part.type === "source-document"
  );

  if (sources.length === 0) {
    return null;
  }

  return (
    <Sources className="mt-3 font-serif text-[13px] text-garden-moss/70">
      <SourcesTrigger
        count={sources.length}
        className="italic text-garden-olive transition-colors hover:text-garden-moss"
      />
      <SourcesContent className="max-w-full">
        {sources.map((part) =>
          part.type === "source-url" ? (
            <Source
              key={part.sourceId}
              href={part.url}
              title={sourceLabel(part)}
              className="max-w-full px-0 py-1 text-garden-moss underline underline-offset-4 transition-colors hover:text-garden-olive"
            />
          ) : (
            <span key={part.sourceId} className="py-1 text-garden-moss">
              {sourceLabel(part)}
            </span>
          )
        )}
      </SourcesContent>
    </Sources>
  );
}

export function FAQChat() {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
      }),
    []
  );

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    regenerate,
    clearError,
  } = useChat({ transport, experimental_throttle: 50 });

  const isBusy = status === "submitted" || status === "streaming";
  const lastAssistantMessageId = messages.findLast(
    (message) => message.role === "assistant"
  )?.id;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, status]);

  const ask = (text: string) => {
    const trimmed = text.trim();

    if (!trimmed || isBusy) {
      return;
    }

    clearError();
    void sendMessage({ text: trimmed });
  };

  return (
    <section
      className="faq-cave-wall relative min-h-[calc(100svh-8rem)]"
      data-route="faq-chat"
    >
      <div
        aria-live="polite"
        className="relative z-10 mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-3xl flex-col gap-6 px-4 pb-[30rem] pt-6 sm:px-6 sm:pb-[32rem] sm:pt-8"
        role="log"
      >
        {messages.map((message) => (
          <Message
            key={message.id}
            from={message.role}
            className={cn(
              "max-w-[92%]",
              message.role === "assistant" && "max-w-full"
            )}
          >
            <MessageContent
              className={cn(
                "font-serif text-[18px] leading-relaxed",
                "group-[.is-user]:rounded-none group-[.is-user]:bg-transparent group-[.is-user]:px-0 group-[.is-user]:py-0 group-[.is-user]:text-garden-olive",
                "group-[.is-assistant]:w-full group-[.is-assistant]:text-garden-ink"
              )}
            >
              {message.parts.map((part, index) =>
                part.type === "text" ? (
                  <MessageResponse
                    animated={message.role === "assistant"}
                    caret="block"
                    isAnimating={
                      status === "streaming" &&
                      message.id === lastAssistantMessageId
                    }
                    key={`${message.id}-${index}`}
                    className="max-w-none font-serif text-[18px] leading-relaxed [&_*]:font-serif [&_a]:text-garden-moss [&_a]:underline [&_a]:underline-offset-4 [&_li]:leading-relaxed [&_ol]:my-3 [&_p]:leading-relaxed [&_ul]:my-3"
                  >
                    {part.text}
                  </MessageResponse>
                ) : null
              )}
              <MessageSources message={message} />
            </MessageContent>
          </Message>
        ))}

        {status === "submitted" && (
          <Message from="assistant" className="max-w-full">
            <MessageContent className="font-serif text-[18px] text-garden-moss">
              <Shimmer className="font-serif italic" duration={1.4}>
                Poncho is checking the details...
              </Shimmer>
            </MessageContent>
          </Message>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-3 pb-[22rem] sm:px-6 sm:pb-[24rem]">
        <div className="pointer-events-auto mx-auto w-full max-w-3xl">
          {error && (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-sm bg-garden-terracotta/10 px-3 py-2 font-serif text-[13px] text-garden-ink">
              <span>Something went wrong. Poncho can try that again.</span>
              <button
                className="text-garden-moss underline underline-offset-4"
                onClick={() => {
                  clearError();
                  void regenerate();
                }}
                type="button"
              >
                Retry
              </button>
            </div>
          )}

          <PromptInput
            className="overflow-hidden rounded-2xl border border-garden-moss/18 bg-[#3f3e19]/30 shadow-[0_24px_70px_rgba(28,17,9,0.16),0_2px_12px_rgba(28,17,9,0.06)] [&_[data-slot=input-group]]:min-h-[8.75rem] [&_[data-slot=input-group]]:flex-col [&_[data-slot=input-group]]:items-stretch [&_[data-slot=input-group]]:border-0 [&_[data-slot=input-group]]:bg-transparent [&_[data-slot=input-group]]:shadow-none"
            onSubmit={({ text }) => ask(text)}
          >
            <PromptInputBody>
              <PromptInputTextarea
                className="min-h-20 px-6 pt-6 font-serif text-[22px] leading-relaxed text-garden-cream placeholder:text-garden-cream/70 md:text-[22px]"
                disabled={status !== "ready"}
                placeholder="Have a question? Ask Poncho!"
              />
            </PromptInputBody>
            <PromptInputFooter className="justify-end px-3 pb-3 pt-1 sm:px-4 sm:pb-4">
              <PromptInputSubmit
                className="size-12 rounded-2xl bg-[#ada736] text-garden-cream shadow-[0_10px_22px_rgba(28,17,9,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e2d649] hover:shadow-[0_14px_28px_rgba(28,17,9,0.2)] active:translate-y-0 active:scale-95 active:bg-[#e2d649] disabled:opacity-45 [&_svg]:transition-transform hover:[&_svg]:-translate-y-0.5"
                disabled={status === "error"}
                onStop={stop}
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>

          <div className="mt-5 flex items-center justify-between gap-3 px-2">
            <Image
              src="/images/poweredbymerit.svg"
              alt="Powered by Merit"
              width={114}
              height={14}
              className="h-3.5 w-auto opacity-80"
            />
            <a
              href="https://tryponcho.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-sm leading-none text-garden-cream/75 transition-colors hover:text-[#e2d649]"
            >
              tryponcho.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
