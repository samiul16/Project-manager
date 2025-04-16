-- DropForeignKey
ALTER TABLE "OrgUserRole" DROP CONSTRAINT "OrgUserRole_orgUserId_fkey";

-- AddForeignKey
ALTER TABLE "OrgUserRole" ADD CONSTRAINT "OrgUserRole_orgUserId_fkey" FOREIGN KEY ("orgUserId") REFERENCES "OrganizationUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
