-- CreateTable
CREATE TABLE "public"."tokens" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pools" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "liquidity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."x_users" (
    "id" TEXT NOT NULL,
    "xId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "isSmart" BOOLEAN NOT NULL DEFAULT false,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "x_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."likes" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "xUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_address_key" ON "public"."tokens"("address");

-- CreateIndex
CREATE UNIQUE INDEX "x_users_xId_key" ON "public"."x_users"("xId");

-- CreateIndex
CREATE UNIQUE INDEX "x_users_username_key" ON "public"."x_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "likes_tokenId_xUserId_key" ON "public"."likes"("tokenId", "xUserId");

-- AddForeignKey
ALTER TABLE "public"."pools" ADD CONSTRAINT "pools_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "public"."tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "public"."tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_xUserId_fkey" FOREIGN KEY ("xUserId") REFERENCES "public"."x_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
