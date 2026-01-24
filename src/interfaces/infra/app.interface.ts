import type { Application } from "express";

export interface IApp {
  getApp(): Application;
}
