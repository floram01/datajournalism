#!/usr/bin/env python
import sys, shutil,os
sys.path.insert(0,'data/boiler_plate')
sys.path.insert(0,'data/data_tools/ressources')
sys.path.insert(0,'app/templates/')
from my_logger import logger
from app import app
from flask import render_template

def run(PROJECT_NAME):
    prepare_data_params(PROJECT_NAME)
    prepare_template(PROJECT_NAME)
    prepare_static(PROJECT_NAME)
    logger.info("don't forget to manually update the app>static>views.py (see instructions in the file)")

def prepare_static(PROJECT_NAME):
    try:
        shutil.copytree('app/static/viz/.boiler_plate', 'app/static/viz/' + PROJECT_NAME)
    except OSError as e:
        if e.strerror=='File exists':
            logger.info('There already is a project named ' + PROJECT_NAME + ', please choose another name')
            sys.exit()
        else: raise
    
    path='app/static/viz/' + PROJECT_NAME + '/parameters.js'
    rename_project(path, PROJECT_NAME)

def prepare_data_params(PROJECT_NAME):
    try:
        shutil.copytree('data/.boiler_plate', 'data/' + PROJECT_NAME)
    except OSError:
        logger.info('There already is a project named ' + PROJECT_NAME + ', please choose another name')
        sys.exit()
    path='data/' + PROJECT_NAME + '/data_params.py'
    rename_project(path, PROJECT_NAME)

def prepare_template(PROJECT_NAME):
    try:
        shutil.copyfile('app/templates/.boiler_plate.html', 'app/templates/' + PROJECT_NAME + '.html')
    except OSError:
        logger.info('There already is a project named ' + PROJECT_NAME + ', please choose another name')
        sys.exit()

    template_path = 'app/templates/' + PROJECT_NAME + '.html'
    rename_project(template_path, PROJECT_NAME)


def rename_project(path, PROJECT_NAME):
    replacements = {'my_project_name':PROJECT_NAME}
    lines =[]

    with open(path) as infile:
        for line in infile:
            for src, target in replacements.iteritems():
                line = line.replace(src, target)
            lines.append(line)
    
    with open(path, 'w') as outfile:
        for line in lines:
            outfile.write(line)

if __name__ == '__main__':
    run(sys.argv[1])