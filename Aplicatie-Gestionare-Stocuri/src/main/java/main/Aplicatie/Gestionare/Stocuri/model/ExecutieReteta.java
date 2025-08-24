package main.Aplicatie.Gestionare.Stocuri.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "executie_reteta")
@Data
public class ExecutieReteta {
    @Id
    @Column(name = "Cod Articol")
    private String codArticol;
    private int portii;
    private String um;
    private int totalPortii;
    private int statusReteta;
    private LocalDate dataUltimaModificare;
    private String utilizator;
    private BigDecimal gramajPerPortie;
    private String numeReteta;
}