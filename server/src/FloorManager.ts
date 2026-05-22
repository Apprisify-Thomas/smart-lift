import { Floor, FloorCompany, FloorEventBanner } from '@client/types';
import fs from 'fs';

export class FloorManager {
  private floors: Floor[] = [];

  constructor(private file: string) {
    this.read();
  }

  getFloors(): Floor[] {
    return this.floors;
  }

  addCompanyToFloor(num: number, company: FloorCompany, index: number | null): void {
    for (const floor of this.floors) {
      if (floor.num === num) {
        if (index !== null) {
          floor.companies.splice(index, 0, company);
        } else {
          floor.companies.push(company);
        }

        break;
      }
    }
  }

  removeCompanyByName(name: string): void {
    for (const floor of this.floors) {
      floor.companies = floor.companies.filter(
        (c) => !c.name.toLowerCase().includes(name.toLowerCase())
      );
    }
  }

  updateCompany(name: string, update: Partial<FloorCompany>, index: number | null): void {
    for (const floor of this.floors) {
      const foundIndex = floor.companies.findIndex((c) =>
        c.name.toLowerCase().includes(name.toLowerCase())
      );

      if (foundIndex >= 0) {
        floor.companies = floor.companies.map((c) => {
          if (c.name.toLowerCase().includes(name.toLowerCase())) {
            return { ...c, ...update };
          }

          return c;
        });

        if (index !== null) {
          const companies = floor.companies.splice(foundIndex, 1);
          floor.companies.splice(index, 0, companies[0]);
        }

        break;
      }
    }
  }

  moveCompanyToFloor(name: string, floor: number): void {
    let companyToMove: FloorCompany | null = null;
    let currentFloorIndex = -1;

    for (let i = 0; i < this.floors.length; i += 1) {
      const companyIndex = this.floors[i].companies.findIndex((c) =>
        c.name.toLowerCase().includes(name.toLowerCase())
      );

      if (companyIndex >= 0) {
        companyToMove = this.floors[i].companies[companyIndex];
        currentFloorIndex = i;
        break;
      }
    }

    if (!companyToMove) {
      return;
    }

    const targetFloor = this.floors.find((f) => f.num === floor);
    if (!targetFloor) {
      return;
    }

    if (this.floors[currentFloorIndex].num === targetFloor.num) {
      return;
    }

    this.floors[currentFloorIndex].companies = this.floors[currentFloorIndex].companies.filter(
      (c) => c.name.toLowerCase() !== companyToMove!.name.toLowerCase()
    );

    targetFloor.companies.push(companyToMove);
  }

  addEventBannerToFloor(num: number, banner: FloorEventBanner): void {
    for (const floor of this.floors) {
      if (floor.num === num) {
        floor.eventBanner = banner;

        break;
      }
    }
  }

  removeEventBannerFromFloor(num: number): void {
    for (const floor of this.floors) {
      if (floor.num === num) {
        delete floor.eventBanner;

        break;
      }
    }
  }

  updateEventBanner(num: number, banner: Partial<FloorEventBanner>): void {
    for (const floor of this.floors) {
      if (floor.num === num) {
        floor.eventBanner = { ...floor.eventBanner, ...banner };

        break;
      }
    }
  }

  read(): void {
    const data = JSON.parse(fs.readFileSync(this.file).toString());
    this.floors = data.floors;
  }

  save(): void {
    fs.writeFileSync(this.file, JSON.stringify({ floors: this.floors }));
  }
}
