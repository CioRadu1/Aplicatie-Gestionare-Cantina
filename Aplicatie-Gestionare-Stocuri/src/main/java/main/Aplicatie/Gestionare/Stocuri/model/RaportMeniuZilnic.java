package main.Aplicatie.Gestionare.Stocuri.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
@Entity
@Table(name = "raport_meniu")
@Data
public class RaportMeniuZilnic {
    @Id
    @Column(name = "Cod articol")
    private String codArticol;
    private int portii;
    private BigDecimal gramajPerPortie;
    private String um;
    private int totalPortii;
    private int statusReteta;
    private LocalDate dataUltimaModificare;
    private String utilizator;
    private String numeReteta;
    private LocalDate dataDeProducere;
    private BigDecimal pretStandard;
    private BigDecimal valoareStandard;
}
