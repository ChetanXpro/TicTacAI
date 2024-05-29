import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json();
        console.log("REQ BODY", reqBody);

        const { allBox } = reqBody;


        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                stream: false,
                model: "gpt-3.5-turbo",

                messages: [
                    {
                        role: "system",
                        content: "You are an AI playing a game of tic-tac-toe. Your main goal is to beat the user.",
                    },
                    {
                        role: "user",
                        content: `If 'Player' is null and 'Move' is empty, then it means that position is empty, and you can move there. 'Move' is either 'X' or 'O', where 'X' is for AI and 'O' is for the user.
                                  Game current state: "${JSON.stringify(allBox)}"
                                  Now it's your turn. What is your move? Your goal is to beat the user.
                                  Output options: topLeft, topCenter, topRight, centerLeft, center, centerRight, bottomLeft, bottomCenter, bottomRight.
                                  You only have to return a JSON with the key 'move' without any other text. Your response will be parsed directly in JavaScript.`,
                    },
                ],
            }),
        });

        console.log("RES", res);


        const data = await res.json();

        return NextResponse.json(data)


    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}