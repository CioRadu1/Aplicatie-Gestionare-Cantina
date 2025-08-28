package main.Aplicatie.Gestionare.Stocuri.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
@Entity
@Table(name = "raport_meniu")
@Data
public class RaportMeniuZilnic {
    @EmbeddedId
    private RaportMeniuZilnicKey id;
    private int portii;
    private BigDecimal gramajPerPortie;
    private String um;
    private int totalPortii;
    private int statusReteta;
    private LocalDate dataUltimaModificare;
    private String utilizator;
    private String numeReteta;
    private BigDecimal pretStandard;
    private BigDecimal valoareStandard;
}
