package main.Aplicatie.Gestionare.Stocuri.controller;

import main.Aplicatie.Gestionare.Stocuri.model.IntrariMagazie;
import main.Aplicatie.Gestionare.Stocuri.model.IntrariMagazieKey;
import main.Aplicatie.Gestionare.Stocuri.service.IntrariMagazieService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/intrari-magazie")
public class IntrariMagazieController {

    private final IntrariMagazieService intrariMagazieService;

    public IntrariMagazieController(IntrariMagazieService intrariMagazieService) {
        this.intrariMagazieService = intrariMagazieService;
    }

    @GetMapping
    public List<IntrariMagazie> getAllIntrari() {
        return intrariMagazieService.findAllIntrari();
    }

    @GetMapping("/{codIngredient}/{dataAchizitie}")
    public ResponseEntity<IntrariMagazie> getIntrareById(
            @PathVariable String codIngredient,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dataAchizitie) {
        IntrariMagazieKey id = new IntrariMagazieKey();
        id.setCodIngredient(codIngredient);
        id.setDataAchizitie(dataAchizitie);
        return intrariMagazieService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public IntrariMagazie createIntrare(@RequestBody IntrariMagazie intrare) {
        return intrariMagazieService.addIntrareMagazie(intrare);
    }

    @PutMapping("/edit-intrare")
    public ResponseEntity<IntrariMagazie> updateIntrare(
            @RequestParam String codIngredient,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate  dataAchizitie,
            @RequestBody IntrariMagazie intrareDetails) {
        IntrariMagazieKey id = new IntrariMagazieKey();
        id.setCodIngredient(codIngredient);
        id.setDataAchizitie(dataAchizitie);
        return intrariMagazieService.findById(id)
                .map(intrare -> {
                    intrare.setNumeIngredient(intrareDetails.getNumeIngredient());
                    intrare.setCantitate(intrareDetails.getCantitate());
                    intrare.setCantitateFolosita(intrareDetails.getCantitateFolosita());
                    intrare.setPretAchizitie(intrareDetails.getPretAchizitie());
                    intrare.setPretTotalCantitateCumparata(intrareDetails.getPretTotalCantitateCumparata());
                    intrare.setPretTotalCantitateUtilizata(intrareDetails.getPretTotalCantitateUtilizata());
                    return ResponseEntity.ok(intrariMagazieService.addIntrareMagazie(intrare));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteIntrare(
            @RequestParam String codIngredient,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate  dataAchizitie) {
        IntrariMagazieKey id = new IntrariMagazieKey();
        id.setCodIngredient(codIngredient);
        id.setDataAchizitie(dataAchizitie);
        if (intrariMagazieService.findById(id).isPresent()) {
            intrariMagazieService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search/cod")
    public List<IntrariMagazie> getIntrariByCodIngredient(@RequestParam String codIngredient, @RequestParam LocalDate dataAchizitie) {
        return intrariMagazieService.findByCodIngredient(codIngredient, dataAchizitie);
    }
}