package main.Aplicatie.Gestionare.Stocuri.controller;

import main.Aplicatie.Gestionare.Stocuri.model.ExecutieReteta;
import main.Aplicatie.Gestionare.Stocuri.service.ExecutieRetetaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/executii-retete")
public class ExecutieRetetaController {

    private final ExecutieRetetaService executieRetetaService;

    public ExecutieRetetaController(ExecutieRetetaService executieRetetaService) {
        this.executieRetetaService = executieRetetaService;
    }

    @GetMapping
    public List<ExecutieReteta> getAllExecutii() {
        return executieRetetaService.findAllExecutii();
    }

    @GetMapping("/{codArticol}")
    public ResponseEntity<ExecutieReteta> getExecutieById(@PathVariable String codArticol) {
        return executieRetetaService.findById(codArticol)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ExecutieReteta createExecutie(@RequestBody ExecutieReteta executieReteta) {
        return executieRetetaService.saveExecutieReteta(executieReteta);
    }

    @PutMapping("/update")
    public ResponseEntity<ExecutieReteta> updateExecutie(@RequestParam String codArticol, @RequestBody ExecutieReteta executieDetails) {
        return executieRetetaService.findById(codArticol)
                .map(executie -> {
                    executie.setCodArticol(executieDetails.getCodArticol());
                    executie.setNumeReteta(executieDetails.getNumeReteta());
                    executie.setPortii(executieDetails.getPortii());
                    executie.setTotalPortii(executieDetails.getTotalPortii());
                    executie.setStatusReteta(executieDetails.getStatusReteta());
                    executie.setUm(executieDetails.getUm());
                    executie.setUtilizator(executieDetails.getUtilizator());
                    executie.setGramajPerPortie(executieDetails.getGramajPerPortie());
                    executie.setDataUltimaModificare(executieDetails.getDataUltimaModificare());
                    return ResponseEntity.ok(executieRetetaService.saveExecutieReteta(executie));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete-reteta")
    public ResponseEntity<Void> deleteExecutie(@RequestParam String codArticol) {
        if (executieRetetaService.findById(codArticol).isPresent()) {
            executieRetetaService.deleteExecutieReteta(codArticol);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update-portii")
    public ResponseEntity<ExecutieReteta> updatePortii(
            @RequestParam String codArticol,
            @RequestParam int totalPortii) {

        return executieRetetaService.updatePortii(codArticol, totalPortii)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/um-options")
    public List<String> getUmOptions() {
        return executieRetetaService.findAllUmOptions();
    }

    @GetMapping("/search")
    public List<ExecutieReteta> getExecutiiByNumeReteta(@RequestParam String nume) {
        return executieRetetaService.findByNumeReteta(nume);
    }

    @GetMapping("/status")
    public int getStatusReteta(@RequestParam String codArticol) {
        return executieRetetaService.findStatusByCodReteta(codArticol);
    }
}