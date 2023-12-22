/*
  Warnings:

  - Added the required column `id_laporan` to the `Laporan_Harian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Laporan_Harian` ADD COLUMN `id_laporan` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Laporan_Harian` ADD CONSTRAINT `Laporan_Harian_id_laporan_fkey` FOREIGN KEY (`id_laporan`) REFERENCES `Laporan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
