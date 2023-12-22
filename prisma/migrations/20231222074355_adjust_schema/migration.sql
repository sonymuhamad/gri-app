/*
  Warnings:

  - You are about to drop the column `id_user` on the `Laporan_Harian` table. All the data in the column will be lost.
  - Added the required column `file_url` to the `Laporan_Harian` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Laporan_Harian` DROP FOREIGN KEY `Laporan_Harian_id_user_fkey`;

-- AlterTable
ALTER TABLE `Laporan_Harian` DROP COLUMN `id_user`,
    ADD COLUMN `file_url` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Laporan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `notes` TEXT NOT NULL,
    `id_bidang_pekerjaan` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Laporan` ADD CONSTRAINT `Laporan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Laporan` ADD CONSTRAINT `Laporan_id_bidang_pekerjaan_fkey` FOREIGN KEY (`id_bidang_pekerjaan`) REFERENCES `Bidang_Pekerjaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
