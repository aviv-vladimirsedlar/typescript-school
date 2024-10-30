/*
  Warnings:

  - A unique constraint covering the columns `[roleId,action]` on the table `RoleAllowed` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RoleAllowed_roleId_action_key" ON "RoleAllowed"("roleId", "action");
