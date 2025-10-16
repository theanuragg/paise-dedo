"use client";

import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import axios from "axios";

export async function fetchSolBalance(
  connection: Connection,
  address: PublicKey
): Promise<number> {
  const lamports = await connection.getBalance(address);
  return lamports / LAMPORTS_PER_SOL;
}