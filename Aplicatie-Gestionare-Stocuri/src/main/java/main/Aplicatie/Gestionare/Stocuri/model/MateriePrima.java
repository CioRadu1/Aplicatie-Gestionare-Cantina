package main.Aplicatie.Gestionare.Stocuri.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "materie_prima")
@Data
public class MateriePrima {
    @Id
    @Column(name = "Cod Articol")
    private String codArticol;
    @Column(name = "Cod moneda")
    private String codMoneda;
    private String denumire;
    @Column(name = "Denumire scurta")
    private String denumireScurta;
    @Column(name = "Denumire UM")
    private String denumireUm;
    private String gestiune;
    private String gestiune1;
    private String um;
    @Column(name = "TVA vanzare")
    private String tvaVanzare;
    private BigDecimal pretMateriePrima;
    private BigDecimal stoculActualTotal;
}