"use client";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Sparkles } from "lucide-react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { ScrollArea } from "@/components/ui/scroll-area";
import remarkGfm from "remark-gfm";

type Props = { isUser: boolean };

export default function Conversation({ isUser }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamedMessage, setStreamedMessage] = useState<string>(``);
  const [error, setError] = useState<string | null>(null);

  const essay = `
  # Nepal: A Land of Natural Beauty and Cultural Heritage

Nepal, a landlocked country located in South Asia, is known for its breathtaking landscapes, rich cultural heritage, and ancient history. Nestled between India and China, it is home to some of the world's tallest peaks, including the majestic Mount Everest, the highest point on Earth. This small but diverse nation is a popular destination for trekkers, mountaineers, and adventure enthusiasts.

## Geography and Natural Beauty

Nepal is often referred to as a "living paradise" due to its stunning natural beauty. The country's geography is incredibly diverse, ranging from the flat plains of the Terai region to the towering peaks of the Himalayas. The country is divided into three distinct regions: the Himalayas, the mid-hills, and the Terai plains. Each of these regions offers unique landscapes and opportunities for exploration.

The Himalayas, which form the northern border of Nepal, are home to some of the most iconic mountains in the world. These mountains not only provide a stunning backdrop but also support diverse ecosystems and wildlife. In addition to Mount Everest, the region boasts other peaks like Kanchenjunga, Lhotse, and Annapurna, making Nepal a haven for mountaineers and trekkers.

## Cultural Heritage

Nepal is a melting pot of cultures and traditions. The country is home to various ethnic groups, including the Gurungs, Magars, Newars, Sherpas, and many more. Each group has its own unique language, customs, and traditions, contributing to Nepal's rich cultural tapestry. The dominant religions in Nepal are Hinduism and Buddhism, both of which have deeply influenced the country's festivals, rituals, and architecture.

Kathmandu, the capital city, is a UNESCO World Heritage site and is known for its historic temples, stupas, and palaces. The Kathmandu Valley is home to some of the most significant cultural landmarks, including the Pashupatinath Temple, Swayambhunath Stupa (also known as the Monkey Temple), and Boudhanath Stupa. These sites reflect the deep spiritual and religious significance of the region and attract pilgrims and tourists from around the world.

## Challenges and Opportunities

Despite its natural beauty and rich culture, Nepal faces several challenges. The country is prone to natural disasters, such as earthquakes and floods, which have affected the lives of millions of people. The 2015 earthquake, in particular, caused widespread devastation and loss of life, leaving the country in need of reconstruction and recovery.

However, Nepal's resilience and determination to rebuild have also opened new opportunities. The country has made significant progress in tourism, agriculture, and infrastructure development. Additionally, Nepal's government has been focusing on improving education, healthcare, and women's rights, working towards a more inclusive and prosperous future.

## Conclusion

Nepal is a country that offers something for everyone. Whether you are an adventurer seeking to scale the peaks of the Himalayas or a cultural enthusiast exploring ancient temples and festivals, Nepal is a place of wonder and discovery. Despite its challenges, the nation's natural beauty, cultural diversity, and warm-hearted people continue to make it a unique and cherished destination for travelers and locals alike.

  `;

  return (
    <div className="flex flex-col space-y-10 text-lg  font-medium items-center">
      {isUser ? (
        <div className="bg-gray-400/10 p-3 rounded-xl right-0 border flex shadow-md self-end">
          please find me a best hotel in gandhinagar Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Voluptatibus voluptate itaque excepturi,
          saepe voluptates voluptatem deserunt qui, minima vitae nisi, ipsum
          esse a? Repellendus, nisi minus dolores ducimus nulla rerum?
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <Sparkles
              size={20}
              className={`text-pink-400 ${isLoading ? "animate-pulse" : ""}`}
            />
            <p className="font-bold">
              {isLoading ? "Sanku is thinking" : "Sanku"}
            </p>
            {isLoading && (
              <div className="inline-flex ml-1 items-center">
                <span className="h-2 w-2 rounded-full bg-pink-400 mx-0.5 animate-pulse"></span>
                <span className="h-2 w-2 rounded-full bg-pink-400 mx-0.5 animate-pulse delay-300"></span>
                <span className="h-2 w-2 rounded-full bg-pink-400 mx-0.5 animate-pulse delay-700"></span>
              </div>
            )}
          </div>

          {error ? (
            <div className="text-red-400 italic">{error}</div>
          ) : (
            essay && (
              <div className="prose prose-slate dark:prose-invert prose-md text-white prose-li:marker:text-pink-400 prose-p:font-semibold max-w-4xl px-3">
                <Markdown remarkPlugins={[remarkGfm]}>{essay}</Markdown>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
