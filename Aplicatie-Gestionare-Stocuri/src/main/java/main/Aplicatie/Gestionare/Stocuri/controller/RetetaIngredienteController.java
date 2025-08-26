package main.Aplicatie.Gestionare.Stocuri.controller;

import main.Aplicatie.Gestionare.Stocuri.model.RetetaIngrediente;
import main.Aplicatie.Gestionare.Stocuri.model.RetetaIngredienteKey;
import main.Aplicatie.Gestionare.Stocuri.service.RetetaIngredienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reteta-ingrediente")
public class RetetaIngredienteController {


    private final RetetaIngredienteService retetaIngredienteService;

    public RetetaIngredienteController(RetetaIngredienteService retetaIngredienteService) {
        this.retetaIngredienteService = retetaIngredienteService;
    }

    @GetMapping
    public List<RetetaIngrediente> getAllRetetaIngrediente() {
        return retetaIngredienteService.findAllRetetaIngrediente();
    }

    @GetMapping("/ingrediente")
    public ResponseEntity<List<RetetaIngrediente>> getIngredienteByRetetaId(
            @RequestParam String codReteta) {
        List<RetetaIngrediente> ingrediente = retetaIngredienteService.findByCodReteta(codReteta);
        return ResponseEntity.ok(ingrediente);
    }

    @PostMapping
    public RetetaIngrediente createRetetaIngrediente(@RequestBody RetetaIngrediente retetaIngrediente) {
        return retetaIngredienteService.saveRetetaIngrediente(retetaIngrediente);
    }

    @PutMapping("/update_numar_ingrediente")
    public ResponseEntity<RetetaIngrediente> updateRetetaIngrediente(
            @RequestParam String codReteta,
            @RequestParam String codIngredient,
            @RequestBody RetetaIngrediente retetaIngredienteDetails) {
        RetetaIngredienteKey id = new RetetaIngredienteKey();
        id.setCodReteta(codReteta);
        id.setCodIngredient(codIngredient);

        Optional<RetetaIngrediente> optionalRetetaIngrediente = retetaIngredienteService.findById(id);

        if (optionalRetetaIngrediente.isPresent()) {
            RetetaIngrediente retetaIngrediente = optionalRetetaIngrediente.get();
            retetaIngrediente.setNumeMateriePrima(retetaIngredienteDetails.getNumeMateriePrima());
            retetaIngrediente.setCantitate(retetaIngredienteDetails.getCantitate());
            retetaIngrediente.setUm(retetaIngredienteDetails.getUm());
            retetaIngrediente.setNecesar(retetaIngredienteDetails.getNecesar());
            retetaIngrediente.setNumeReteta(retetaIngredienteDetails.getNumeReteta());
            return ResponseEntity.ok(retetaIngredienteService.saveRetetaIngrediente(retetaIngrediente));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update-necesar")
    public ResponseEntity<RetetaIngrediente> updateCantitate(
            @RequestParam String codReteta,
            @RequestParam String codIngredient,
            @RequestParam BigDecimal necesar) {

        RetetaIngredienteKey id = new RetetaIngredienteKey();
        id.setCodReteta(codReteta);
        id.setCodIngredient(codIngredient);

        Optional<RetetaIngrediente> optional = retetaIngredienteService.findById(id);

        if (optional.isPresent()) {
            RetetaIngrediente ingrediente = optional.get();
            ingrediente.setNecesar(necesar);
            return ResponseEntity.ok(retetaIngredienteService.saveRetetaIngrediente(ingrediente));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete-ingredient")
    public ResponseEntity<Void> deleteRetetaIngrediente(
            @RequestParam String codReteta,
            @RequestParam String codIngredient) {
        RetetaIngredienteKey id = new RetetaIngredienteKey();
        id.setCodReteta(codReteta);
        id.setCodIngredient(codIngredient);
        if (retetaIngredienteService.findById(id).isPresent()) {
            retetaIngredienteService.deleteRetetaIngrediente(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/search/reteta")
    public List<RetetaIngrediente> getIngredienteByCodReteta(@RequestParam String codReteta) {
        return retetaIngredienteService.findByCodReteta(codReteta);
    }
}