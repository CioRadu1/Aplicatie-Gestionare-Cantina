package main.Aplicatie.Gestionare.Stocuri.controller;

import main.Aplicatie.Gestionare.Stocuri.model.MeniuZilnic;
import main.Aplicatie.Gestionare.Stocuri.service.MeniuZilnicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/meniu-zilnic")
public class MeniuZilnicController {

    private final MeniuZilnicService meniuZilnicService;

    public MeniuZilnicController(MeniuZilnicService meniuZilnicService) {
        this.meniuZilnicService = meniuZilnicService;
    }

    @GetMapping
    public List<MeniuZilnic> getAllMeniuZilnic() {
        return meniuZilnicService.findAllMeniuZilnic();
    }

    @GetMapping("/{codArticol}")
    public ResponseEntity<MeniuZilnic> getMeniuZilnicById(@PathVariable String codArticol) {
        return meniuZilnicService.findById(codArticol)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{codArticol}")
    public ResponseEntity<Void> deleteMeniuZilnic(@PathVariable String codArticol) {
        if (meniuZilnicService.findById(codArticol).isPresent()) {
            meniuZilnicService.deleteMeniuZilnic(codArticol);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public List<MeniuZilnic> getMeniuByNumeReteta(@RequestParam String nume) {
        return meniuZilnicService.findByNumeReteta(nume);
    }
}