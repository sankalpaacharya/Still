"use client";
import React, { useState } from "react";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Friend = {
  id: string;
  name: string;
  avatar: string;
  category: string;
  amount: string;
  streak: number;
};

export default function FriendsPage() {
  const [friends] = useState<Friend[]>([
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "A",
      category: "Groceries",
      amount: "$42.99",
      streak: 18,
    },
    {
      id: "2",
      name: "Sam Wilson",
      avatar: "S",
      category: "Coffee",
      amount: "$5.25",
      streak: 15,
    },
    {
      id: "3",
      name: "Taylor Kim",
      avatar: "T",
      category: "Gym",
      amount: "$25.00",
      streak: 30,
    },
    {
      id: "4",
      name: "Jordan Lee",
      avatar: "J",
      category: "Books",
      amount: "$32.50",
      streak: 8,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gradient">Friends</h2>
        <p className="mt-1 text-muted-foreground">
          Keep track of your friends&apos; spending habits
        </p>
      </div>

      {/* Search and Add Friend */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            className="pl-10"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Friend</span>
        </Button>
      </div>

      {/* Friends List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>👥</span> Friends List
            </CardTitle>
            <CardDescription>{friends.length} friends</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFriends.length > 0 ? (
            <div className="space-y-4">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {friend.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{friend.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>💼 {friend.category}</span>
                        <span>•</span>
                        <span>{friend.amount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-amber-500">
                      🔥 {friend.streak} day streak
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No friends found matching &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
