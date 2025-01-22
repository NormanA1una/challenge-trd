import { NextResponse } from "next/server";
import { supabase } from "@/lib/utils/supabase";

export async function POST(request: Request) {
  try {
    const userData = await request.json();

    console.log(userData);
    
    const { data, error } = await supabase
      .from('user')
      .insert([userData])
      .select()
      .single();

    if (error) {
        console.log(error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la solicitud " + error },
      { status: 500 }
    );
  }
}
