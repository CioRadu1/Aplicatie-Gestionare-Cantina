package main.Aplicatie.Gestionare.Stocuri.service;

import main.Aplicatie.Gestionare.Stocuri.model.IntrariMagazie;
import main.Aplicatie.Gestionare.Stocuri.model.MateriePrima;
import main.Aplicatie.Gestionare.Stocuri.repository.IntrariMagazieRepository;
import main.Aplicatie.Gestionare.Stocuri.repository.MateriePrimaRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class MateriePrimaExportService {

    private final MateriePrimaRepository materiePrimaRepository;
    private final IntrariMagazieRepository intrariMagazieRepository;

    public MateriePrimaExportService(MateriePrimaRepository materiePrimaRepository, IntrariMagazieRepository intrariMagazieRepository) {
        this.materiePrimaRepository = materiePrimaRepository;
        this.intrariMagazieRepository = intrariMagazieRepository;
    }
    public byte[] exportToExcel() throws IOException {
        List<MateriePrima> materiiPrime = materiePrimaRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Materii Prime");

            // Antetul tabelului
            String[] headers = {"Nr. Crt.", "Cod Articol", "Denumire Articol", "UM", "Cantitate", "Pret Unit. Mediu", "Valoare Stoc"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowNum = 1;
            for (MateriePrima mp : materiiPrime) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(rowNum - 1); // Nr. Crt.
                row.createCell(1).setCellValue(mp.getCodArticol());
                row.createCell(2).setCellValue(mp.getDenumire());
                row.createCell(3).setCellValue(mp.getUm());

                double stocRamas = mp.getStoculActualTotal().doubleValue();
                double valoareStocTotal = 0.0;
                double cantitateTotalaFolositaInCalcul = 0.0;

                List<IntrariMagazie> intrari = intrariMagazieRepository.findById_CodIngredientOrderById_DataAchizitieAsc(mp.getCodArticol());

                for (IntrariMagazie intrare : intrari) {
                    double cantitateDisponibila = intrare.getCantitate().doubleValue() - intrare.getCantitateFolosita().doubleValue();

                    if (stocRamas > 0 && cantitateDisponibila > 0) {
                        double cantitateDeCalculat = Math.min(stocRamas, cantitateDisponibila);

                        valoareStocTotal += cantitateDeCalculat * intrare.getPretAchizitie().doubleValue();
                        cantitateTotalaFolositaInCalcul += cantitateDeCalculat;
                        stocRamas -= cantitateDeCalculat;
                    }
                }

                double pretMediu = cantitateTotalaFolositaInCalcul > 0 ? valoareStocTotal / cantitateTotalaFolositaInCalcul : 0.0;

                row.createCell(4).setCellValue(mp.getStoculActualTotal().doubleValue());
                row.createCell(5).setCellValue(pretMediu);
                row.createCell(6).setCellValue(valoareStocTotal);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}