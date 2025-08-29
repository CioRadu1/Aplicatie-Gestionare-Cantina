package main.Aplicatie.Gestionare.Stocuri.controller;

import main.Aplicatie.Gestionare.Stocuri.model.MateriePrima;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import main.Aplicatie.Gestionare.Stocuri.service.MateriePrimaExportService;
import main.Aplicatie.Gestionare.Stocuri.service.MateriePrimaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/materii-prime")
public class MateriePrimaController {

    private final MateriePrimaService materiePrimaService;
    private final MateriePrimaExportService materiePrimaExportService;

    public MateriePrimaController(MateriePrimaService materiePrimaService, MateriePrimaExportService materiePrimaExportService) {
        this.materiePrimaService = materiePrimaService;
        this.materiePrimaExportService = materiePrimaExportService;
    }

    @GetMapping
    public List<MateriePrima> getAllMateriiPrime() {
        return materiePrimaService.findAllMateriiPrime();
    }

    @GetMapping("/getInfo")
    public ResponseEntity<MateriePrima> getMateriePrimaById(@RequestParam String codArticol) {
        return materiePrimaService.findById(codArticol)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MateriePrima createMateriePrima(@RequestBody MateriePrima materiePrima) {
        return materiePrimaService.saveMateriePrima(materiePrima);
    }

    @PutMapping("/{codArticol}")
    public ResponseEntity<MateriePrima> updateMateriePrima(@PathVariable String codArticol, @RequestBody MateriePrima materiePrimaDetails) {
        return materiePrimaService.findById(codArticol)
                .map(materiePrima -> {
                    materiePrima.setCodArticol(materiePrimaDetails.getCodArticol());
                    materiePrima.setCodMoneda(materiePrimaDetails.getCodMoneda());
                    materiePrima.setDenumire(materiePrimaDetails.getDenumire());
                    materiePrima.setDenumireScurta(materiePrimaDetails.getDenumireScurta());
                    materiePrima.setDenumireUm(materiePrimaDetails.getDenumireUm());
                    materiePrima.setGestiune(materiePrimaDetails.getGestiune());
                    materiePrima.setGestiune1(materiePrimaDetails.getGestiune1());
                    materiePrima.setStoculActualTotal(materiePrimaDetails.getStoculActualTotal());
                    materiePrima.setPretMateriePrima(materiePrimaDetails.getPretMateriePrima());
                    materiePrima.setUm(materiePrimaDetails.getUm());
                    materiePrima.setTvaVanzare(materiePrimaDetails.getTvaVanzare());
                    return ResponseEntity.ok(materiePrimaService.saveMateriePrima(materiePrima));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete-materie")
    public ResponseEntity<Void> deleteMateriePrima(@RequestParam String codArticol) {
        if (materiePrimaService.findById(codArticol).isPresent()) {
            materiePrimaService.deleteMateriePrima(codArticol);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search/denumire")
    public List<MateriePrima> getMateriiPrimeByDenumire(@RequestParam String denumire) {
        return materiePrimaService.findByDenumire(denumire);
    }

    @GetMapping("/search/gestiune")
    public List<MateriePrima> getMateriiPrimeByGestiune(@RequestParam String gestiune) {
        return materiePrimaService.findByGestiune(gestiune);
    }

    @GetMapping("/export")
    public ResponseEntity<ByteArrayResource> exportMateriiPrime() throws IOException {
        byte[] excelBytes = materiePrimaExportService.exportToExcel();

        ByteArrayResource resource = new ByteArrayResource(excelBytes);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=materii_prime.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(resource);
    }
}