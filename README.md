# Cupid's Adventure - Valentine's Day Game

A charming Valentine's Day game designed to surprise your special someone with a fun, interactive proposal at the end.

![Cupid's Adventure](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pixel-heart-2779422_1280-Q4PY8sNKG8NPMKPB31K2hoHi3Gysph.png)

## Overview

Cupid's Adventure is a collection of three mini-games that lead to a Valentine's Day proposal. The player must complete all three levels to reach the final screen where they can ask their Valentine to be theirs.

## Game Levels

1. **Find the Queen** - A card game where players must track and find the Queen card through increasingly difficult shuffling stages.
2. **Appa Dodge** - Help Appa dodge fireballs for 30 seconds using the up and down arrow keys.
3. **Connections** - Find groups of four words that share a common theme.

## Customizing for Your Valentine

### Setting Your Partner's Name

To personalize the game for your Valentine, you'll need to edit the name in the proposal message:

1. Open the file: `app/components/FinalScreen.tsx`
2. Find line 74 (approximately) with the text:
   ```tsx
   <h1 className="text-2xl font-normal mb-8 text-black tracking-wide z-10">
     Grace Fawaz, Will you do me the honour this February 14th and be my Valentine?
   </h1>

