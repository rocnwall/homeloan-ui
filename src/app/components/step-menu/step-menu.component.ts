import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core'
import { MenuItem } from 'primeng/api';
import { Project } from 'src/app/Models/mortgage-project';
import { Simulation } from 'src/app/Models/simulation';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MortgageSimulationService } from 'src/app/services/mortgage-simulation.service';
import { MortgageProjectService } from 'src/app/services/mortgage-project.service';

@Component({
  selector: 'app-step-menu',
  templateUrl: './step-menu.component.html',
  styleUrls: ['./step-menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StepMenuComponent implements OnInit {
  items: MenuItem[];
  activeIndex: number;
  currentProject: Project;
  currentSimulation: Simulation;
  isSavedProject: boolean;
  doesDataExist: boolean;

  constructor(private route: ActivatedRoute,
              private mortgageProjectService: MortgageProjectService,
              private mortgageSimulationService: MortgageSimulationService) { }

  ngOnInit() {
    this.doesDataExist = false;

    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      const obsProject: Observable<Project> = this.mortgageProjectService.getMortgageProject(projectId);
      obsProject.subscribe(data => {
        this.currentProject = data;
        const obsSimulation: Observable<Simulation> = this.mortgageSimulationService.getSimulation(projectId);
        obsSimulation.subscribe(otherData => {
          this.currentSimulation = otherData;
          this.doesDataExist = true;
        });
      });
      this.isSavedProject = true;
    } else {
      this.doesDataExist = true;
      this.isSavedProject = false;
    }

    this.activeIndex = 0;

    this.items = [{
      label: 'Projet',
      command: (event: any) => {
        this.activeIndex = 0;
      }
    },
    {
      label: 'Emprunteurs',
      command: (event: any) => {
        this.activeIndex = 1;
      }
    },
    {
      label: 'Simulation',
      command: (event: any) => {
        this.activeIndex = 2;
      }
    },
    {
      label: 'Synthèse',
      command: (event: any) => {
        this.activeIndex = 3;
      }
    }
    ];
  }

  incrementProjectStep(project: Project) {
    this.currentProject = project;
    this.isSavedProject = true;
    this.activeIndex++;
  }

  decrementProjectStep(project: Project) {
    this.currentProject = project;
    this.activeIndex--;
  }

  incrementSimulationStep(simulation: Simulation) {
    this.currentSimulation = simulation;
    this.activeIndex++;
  }

  decrementSimulationStep(simulation: Simulation) {
    this.currentSimulation = simulation;
    this.activeIndex--;
  }

}
