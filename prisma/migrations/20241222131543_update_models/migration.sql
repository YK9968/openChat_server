/*
  Warnings:

  - You are about to drop the `_ChatToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId1` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId2` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_B_fkey";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "userId1" TEXT NOT NULL,
ADD COLUMN     "userId2" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ChatToUser";

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
