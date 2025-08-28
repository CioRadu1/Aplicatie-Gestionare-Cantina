package main.Aplicatie.Gestionare.Stocuri.controller;

import main.Aplicatie.Gestionare.Stocuri.model.*;
import main.Aplicatie.Gestionare.Stocuri.service.RaportMeniuZilnicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/raport-meniul-zilei")
public class RaportMeniuZilnicController {

    private final RaportMeniuZilnicService raportMeniuZilnicService;

    public RaportMeniuZilnicController(RaportMeniuZilnicService raportMeniuZilnicService) {
        this.raportMeniuZilnicService = raportMeniuZilnicService;
    }
    @PostMapping
    public RaportMeniuZilnic createIntrare(@RequestBody RaportMeniuZilnic intrare) {
        return raportMeniuZilnicService.addRaportMeniuZilnic(intrare);
    }
    @PutMapping("/update-pret")
    public ResponseEntity<RaportMeniuZilnic> updatePretReteteFaraIngredeiente(
            @RequestParam String codArticol,
            @RequestParam LocalDate dataDeProducere,
            @RequestParam BigDecimal pretStandard){
        RaportMeniuZilnicKey id = new RaportMeniuZilnicKey();
        id.setCodArticol(codArticol);
        id.setDataDeProducere(dataDeProducere);
        System.out.println(codArticol + " " + dataDeProducere+ " " + pretStandard);
        return raportMeniuZilnicService.updatePret(id, pretStandard)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping
    public List<RaportMeniuZilnic> getAllRaportMeniuZilnic() {
        return raportMeniuZilnicService.findAllRaportMeniuZilnic();
    }
    @DeleteMapping("/delete-reteta")
    public ResponseEntity<Void> deleteRetetaRaportMeniuZilnic(@RequestParam String codArticol) {
        if (!raportMeniuZilnicService.findByCodArticolToDelete(codArticol).isEmpty()) {
            raportMeniuZilnicService.deleteRaportMeniuZilnic(codArticol);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/report-by-key")
    public Optional<RaportMeniuZilnic> getRaportMeniuZilnicByKey(@RequestParam String codArticol, @RequestParam LocalDate dataDeProducere) {
        RaportMeniuZilnicKey id = new RaportMeniuZilnicKey();
        id.setCodArticol(codArticol);
        id.setDataDeProducere(dataDeProducere);
        return raportMeniuZilnicService.findById(id);
    }

}