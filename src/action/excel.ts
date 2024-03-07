const ExcelJS = require("exceljs");

import { toDataURL } from "@/lib/utils";

import { Prisma } from "@prisma/client";

type Proyek = Prisma.ProyekGetPayload<{
  include: {
    bidang_pekerjaan: {
      include: {
        pekerjaan: {
          include: {
            sub_pekerjaan: {
              include: {
                laporan_harian: true;
                satuan: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export async function DownloadExcel({ proyek }: { proyek: Proyek | null }) {
  if (!proyek) {
    return;
  }

  var workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const setMergedCellsBorder = (row: number, col: number) => {
    const cell = worksheet.getCell(row, col);
    cell.border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
  };

  const fillCellsWithColor = (selectedCell: any, color = "add8e6") => {
    selectedCell.style.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: color }, // Replace 'FFFF00' with your desired color code
    };
  };

  const mergeHeaderAndSetBorder = (cells: string, cell: string) => {
    worksheet.mergeCells(cells);
    const selectedCell = worksheet.getCell(cell);
    fillCellsWithColor(selectedCell);

    selectedCell.border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
  };

  const mergeAndFillAndSetBorder = (cells: string, cell: string) => {
    worksheet.mergeCells(cells);
    const selectedCell = worksheet.getCell(cell);
    fillCellsWithColor(selectedCell, "F5F4F2 ");

    selectedCell.border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
  };

  const mergeCellsAndSetBorder = (cells: string, cell: string) => {
    worksheet.mergeCells(cells);
    const selectedCell = worksheet.getCell(cell);

    selectedCell.border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
  };

  const addTextTitle = (
    row: number,
    col: number,
    text: string,
    bold = false
  ) => {
    const cellValueProyek = worksheet.getCell(row, col);

    cellValueProyek.value = text;

    cellValueProyek.font = {
      size: 10,
      bold,
    };
    cellValueProyek.alignment = {
      horizontal: "left",
      wrapText: false,
    };
  };

  const addText = (
    row: number,
    col: number,
    text: string,
    fontSize = 9,
    bold = true,
    horizontal = "center"
  ) => {
    const cell = worksheet.getCell(row, col);

    cell.value = text;

    cell.font = {
      size: fontSize,
      bold: bold,
    };
    cell.alignment = {
      horizontal,
      vertical: "middle", // You can adjust vertical alignment if needed
      wrapText: true,
    };
  };

  worksheet.mergeCells(2, 2, 6, 6);
  worksheet.mergeCells(2, 7, 6, 10);
  worksheet.mergeCells(2, 11, 6, 13);
  worksheet.mergeCells(2, 14, 6, 16);

  setMergedCellsBorder(2, 2);
  setMergedCellsBorder(2, 7);
  setMergedCellsBorder(2, 11);
  setMergedCellsBorder(2, 14);

  // await addImage("/patra.png", 250, 50, 1.5);
  // await addImage("/talya.png", 200, 50, 6.5);
  // await addImage("/abipraya.png", 65, 50, 13.25);
  // await addImage("/logo-gri.png", 65, 50, 14.5);

  addText(2, 11, "LAPORAN PROGRESS MINGGUAN", 14, true);

  addTextTitle(8, 2, "PEKERJAAN :");
  addTextTitle(9, 2, "KONTRAK NO :");
  addTextTitle(10, 2, "TANGGAL :");
  addTextTitle(11, 2, "LOKASI :");
  addTextTitle(8, 4, proyek.nama, true);
  addTextTitle(10, 4, proyek.tanggal.toLocaleDateString(), true);
  addTextTitle(11, 4, proyek.lokasi, true);

  mergeHeaderAndSetBorder("B13:B15", "B13");
  addText(13, 2, "NO");

  mergeHeaderAndSetBorder("C13:G15", "C13");
  addText(13, 3, "URAIAN PEKERJAAN");

  mergeHeaderAndSetBorder("H13:H15", "H13");
  addText(13, 8, "SATUAN");

  mergeHeaderAndSetBorder("I13:I15", "I13");
  addText(13, 9, "VOLUME");

  mergeHeaderAndSetBorder("J13:J14", "J13");
  addText(13, 10, "BOBOT");

  mergeHeaderAndSetBorder("J15:J15", "J15");
  addText(15, 10, "%");
  mergeHeaderAndSetBorder("K15:K15", "K15");
  addText(15, 11, "");
  mergeHeaderAndSetBorder("L15:L15", "L15");
  addText(15, 12, "%");
  mergeHeaderAndSetBorder("M15:M15", "M15");
  addText(15, 13, "%");
  mergeHeaderAndSetBorder("N15:N15", "N15");
  addText(15, 14, "");
  mergeHeaderAndSetBorder("O15:O15", "O15");
  addText(15, 15, "%");
  mergeHeaderAndSetBorder("P15:P15", "P15");
  addText(15, 16, "%");

  mergeHeaderAndSetBorder("K13:M13", "K13");
  addText(13, 11, "S/D PERIODE LALU");

  mergeHeaderAndSetBorder("N13:P13", "N13");
  addText(13, 14, "S/D PERIODE INI");

  mergeHeaderAndSetBorder("K14:K14", "K14");
  addText(14, 11, "VOLUME");

  mergeHeaderAndSetBorder("L14:L14", "L14");
  addText(14, 12, "PROGRESS");

  mergeHeaderAndSetBorder("M14:M14", "M14");
  addText(14, 13, "BOBOT");

  mergeHeaderAndSetBorder("N14:N14", "N14");
  addText(14, 14, "VOLUME");

  mergeHeaderAndSetBorder("O14:O14", "O14");
  addText(14, 15, "PROGRESS");

  mergeHeaderAndSetBorder("P14:P14", "P14");
  addText(14, 16, "BOBOT");

  for (let i = 16; i <= 20; i++) {
    mergeCellsAndSetBorder(`B${i}:B${i}`, `B${i}`);
    mergeCellsAndSetBorder(`H${i}:H${i}`, `H${i}`);
    mergeCellsAndSetBorder(`I${i}:I${i}`, `I${i}`);
    mergeCellsAndSetBorder(`J${i}:J${i}`, `J${i}`);
    mergeCellsAndSetBorder(`K${i}:K${i}`, `K${i}`);
    mergeCellsAndSetBorder(`L${i}:L${i}`, `L${i}`);
    mergeCellsAndSetBorder(`M${i}:M${i}`, `M${i}`);
    mergeCellsAndSetBorder(`N${i}:N${i}`, `N${i}`);
    mergeCellsAndSetBorder(`O${i}:O${i}`, `O${i}`);
    mergeCellsAndSetBorder(`P${i}:P${i}`, `P${i}`);
    if (i < 17 && i > 20) {
      mergeCellsAndSetBorder(`C${i}:G${i}`, `C${i}`);
    }
  }

  const mergeAndSetBorderFullRow = (row: number) => {
    mergeCellsAndSetBorder(`B${row}:B${row}`, `B${row}`);
    mergeCellsAndSetBorder(`H${row}:H${row}`, `H${row}`);
    mergeCellsAndSetBorder(`I${row}:I${row}`, `I${row}`);
    mergeCellsAndSetBorder(`J${row}:J${row}`, `J${row}`);
    mergeCellsAndSetBorder(`K${row}:K${row}`, `K${row}`);
    mergeCellsAndSetBorder(`L${row}:L${row}`, `L${row}`);
    mergeCellsAndSetBorder(`M${row}:M${row}`, `M${row}`);
    mergeCellsAndSetBorder(`N${row}:N${row}`, `N${row}`);
    mergeCellsAndSetBorder(`O${row}:O${row}`, `O${row}`);
    mergeCellsAndSetBorder(`P${row}:P${row}`, `P${row}`);
    mergeCellsAndSetBorder(`C${row}:G${row}`, `C${row}`);
  };

  const mergeAndSetBorderAndFillFullRow = (row: number) => {
    mergeAndFillAndSetBorder(`B${row}:B${row}`, `B${row}`);
    mergeAndFillAndSetBorder(`H${row}:H${row}`, `H${row}`);
    mergeAndFillAndSetBorder(`I${row}:I${row}`, `I${row}`);
    mergeAndFillAndSetBorder(`J${row}:J${row}`, `J${row}`);
    mergeAndFillAndSetBorder(`K${row}:K${row}`, `K${row}`);
    mergeAndFillAndSetBorder(`L${row}:L${row}`, `L${row}`);
    mergeAndFillAndSetBorder(`M${row}:M${row}`, `M${row}`);
    mergeAndFillAndSetBorder(`N${row}:N${row}`, `N${row}`);
    mergeAndFillAndSetBorder(`O${row}:O${row}`, `O${row}`);
    mergeAndFillAndSetBorder(`P${row}:P${row}`, `P${row}`);
    mergeAndFillAndSetBorder(`C${row}:G${row}`, `C${row}`);
  };

  mergeCellsAndSetBorder("C17:G17", "C17");
  addText(17, 3, "CATATAN :", 9, true, "left");
  mergeCellsAndSetBorder("C18:G20", "C18");
  addText(
    18,
    3,
    "Sebelum mengisi harga, kontraktor wajib membaca Dokumen Tender dan Catatan Harga dengan seksama agar sudah mengetahui kondisi yang di minta.",
    9,
    true,
    "left"
  );

  let row = 21;
  let totalBobotDasarProyek = 0;
  let totalBobotProyek = 0;

  proyek.bidang_pekerjaan.forEach((bidangPekerjaan) => {
    let totalBobotPercentage = 0;
    let totalBobotDasar = 0;

    const { kode, nama, pekerjaan } = bidangPekerjaan;
    mergeAndSetBorderFullRow(row);
    addText(row, 2, kode, 9, true, "center");
    addText(row, 3, nama, 9, false, "left");
    row++;

    pekerjaan.forEach((pek, index) => {
      const { nama: pekName, sub_pekerjaan } = pek;
      mergeAndSetBorderFullRow(row);
      addText(row, 2, `${index + 1}`, 9, false, "center");
      addText(row, 3, pekName, 9, false, "left");
      row++;

      sub_pekerjaan.forEach((subPekerjaan) => {
        const {
          nama,
          satuan: { nama: namaSatuan },
          laporan_harian,
          target_volume,
          bobot,
        } = subPekerjaan;

        const totalVolume = laporan_harian.reduce((prev, current) => {
          return current.volume + prev;
        }, 0);

        const currentBobot = bobot ?? 0;
        const percentage = (totalVolume / target_volume) * 100;
        const fixedPercentage = percentage > 100 ? 100 : percentage;
        const stringPercentage = fixedPercentage.toFixed(2);

        const percentageFromBobot = (fixedPercentage * currentBobot) / 100;
        const stringPercentageBobot = percentageFromBobot.toFixed(2);

        totalBobotPercentage += percentageFromBobot;
        totalBobotDasar += currentBobot;

        mergeAndSetBorderFullRow(row);
        addText(row, 3, `- ${nama}`, 9, false, "left");
        addText(row, 8, namaSatuan, 9, false, "center");
        addText(row, 9, target_volume.toFixed(2), 9, false, "right");
        addText(row, 10, `${currentBobot.toFixed(2)}%`, 9, false, "right");
        addText(row, 14, totalVolume.toFixed(2), 9, false, "right");
        addText(row, 15, `${stringPercentage}%`, 9, false, "right");
        addText(row, 16, `${stringPercentageBobot}%`, 9, false, "right");

        row++;
      });
    });

    totalBobotDasarProyek += totalBobotDasar;
    totalBobotProyek += totalBobotPercentage;

    mergeAndSetBorderAndFillFullRow(row);
    addText(row, 3, nama, 9, true, "center");
    addText(row, 10, `${totalBobotDasar.toFixed(2)}%`, 9, true, "right");
    addText(row, 12, `0.00%`, 9, true, "right");
    addText(row, 16, `${totalBobotPercentage.toFixed(2)}%`, 9, true, "right");
    row++;
  });

  totalBobotDasarProyek =
    totalBobotDasarProyek > 100 ? 100 : totalBobotDasarProyek;
  totalBobotProyek = totalBobotProyek > 100 ? 100 : totalBobotProyek;

  mergeAndSetBorderAndFillFullRow(row);
  addText(row, 3, "", 9, true, "center");
  addText(row, 10, `${totalBobotDasarProyek.toFixed(2)}%`, 9, true, "right");
  addText(row, 12, `0.00%`, 9, true, "right");
  addText(row, 16, `${totalBobotProyek.toFixed(2)}%`, 9, true, "right");

  row++;
  row++;

  mergeCellsAndSetBorder(`B${row}:F${row + 5}`, `B${row}`);
  mergeCellsAndSetBorder(`G${row}:K${row + 5}`, `G${row}`);
  mergeCellsAndSetBorder(`L${row}:P${row + 5}`, `L${row}`);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${proyek.nama}-${new Date(proyek.tanggal).toDateString()}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
}
