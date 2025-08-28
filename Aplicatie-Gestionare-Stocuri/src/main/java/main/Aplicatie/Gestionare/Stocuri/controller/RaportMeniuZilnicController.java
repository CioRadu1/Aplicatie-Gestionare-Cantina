package main.Aplicatie.Gestionare.Stocuri.controller;

import main.Aplicatie.Gestionare.Stocuri.model.IntrariMagazie;
import main.Aplicatie.Gestionare.Stocuri.model.RaportMeniuZilnic;
import main.Aplicatie.Gestionare.Stocuri.service.RaportMeniuZilnicService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping
    public List<RaportMeniuZilnic> getAllRaportMeniuZilnic() {
        return raportMeniuZilnicService.findAllRaportMeniuZilnic();
    }
}