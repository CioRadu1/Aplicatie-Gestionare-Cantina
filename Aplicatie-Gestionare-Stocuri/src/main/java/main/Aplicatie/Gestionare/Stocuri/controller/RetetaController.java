package main.Aplicatie.Gestionare.Stocuri.controller;

import main.Aplicatie.Gestionare.Stocuri.model.Reteta;
import main.Aplicatie.Gestionare.Stocuri.service.RetetaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/retete")
public class RetetaController {

    private final RetetaService retetaService;

    public RetetaController(RetetaService retetaService) {
        this.retetaService = retetaService;
    }

    @GetMapping
    public List<Reteta> getAllRetete() {
        return retetaService.findAllRetete();
    }

    @GetMapping("/denumireUm-distinct")
    public List<String> getAllDenumireUmDistinct() {
        return retetaService.findAllDenumireUm();
    }

    @GetMapping("/{codArticol}")
    public ResponseEntity<Reteta> getRetetaById(@PathVariable String codArticol) {
        return retetaService.findById(codArticol)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Reteta createReteta(@RequestBody Reteta reteta) {
        return retetaService.saveReteta(reteta);
    }

    @PutMapping("/{codArticol}")
    public ResponseEntity<Reteta> updateReteta(@PathVariable String codArticol, @RequestBody Reteta retetaDetails) {
        return retetaService.findById(codArticol)
                .map(reteta -> {
                    reteta.setCodArticol(retetaDetails.getCodArticol());
                    reteta.setCodMoneda(retetaDetails.getCodMoneda());
                    reteta.setDenumire(retetaDetails.getDenumire());
                    reteta.setDenumireScurta(retetaDetails.getDenumireScurta());
                    reteta.setDenumireUm(retetaDetails.getDenumireUm());
                    reteta.setGestiune(retetaDetails.getGestiune());
                    reteta.setGestiune1(retetaDetails.getGestiune1());
                    reteta.setTvaVanzare(retetaDetails.getTvaVanzare());
                    reteta.setTvaVanzare1(retetaDetails.getTvaVanzare1());
                    reteta.setUm(retetaDetails.getUm());
                    return ResponseEntity.ok(retetaService.saveReteta(reteta));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{codArticol}")
    public ResponseEntity<Void> deleteReteta(@PathVariable String codArticol) {
        if (retetaService.findById(codArticol).isPresent()) {
            retetaService.deleteReteta(codArticol);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public List<Reteta> getReteteByNume(@RequestParam String nume) {
        return retetaService.findByNumeReteta(nume);
    }
}