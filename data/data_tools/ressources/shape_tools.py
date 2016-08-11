#add here all the function you use to shape the data in standard viz format

def prepare_heatmap(df, x_dimension, y_dimension, binXNum=10, binYNum=False, topY=17, exclude_Y=['United States']):
    if exclude_Y:
        df = df[~df[y_dimension].isin(exclude_Y)]
        
    if topY:
        grouped_Y = df.groupby(y_dimension).size().sort_values(ascending=False).reset_index()
        top_index = grouped_Y[y_dimension][0:topY];
        df = df[df[y_dimension].isin(top_index)];
    
    if binXNum:
        binX=np.arange(df[x_dimension].min(),df[x_dimension].max(),binXNum)
        groupX = pd.cut(df[x_dimension], bins=binX, precision=0)
    else:
        groupX = x_dimension
    
    if binYNum:
        binY=np.arange(df[y_dimension].min(),df[y_dimension].max(),binXNum)
        groupY = pd.cut(df[y_dimension], bins=binY, precision=0)
    else:
        groupY = y_dimension
    
    df_heat = df.groupby([groupX,groupY]).size().unstack().fillna(0)
    df_heat = df_heat.stack().reset_index()
    
    x_mapper, y_mapper = map_to_index(df_heat, x_dimension), map_to_index(grouped_Y, y_dimension)
    df_heat['x_index'] = df_heat[x_dimension].astype('str').map(lambda x : x_mapper[x])
    df_heat['y_index'] = df_heat[y_dimension].map(lambda x : y_mapper[x])
    
    df_heat.rename(columns={0:'my_value'}, inplace=True)
    
    return df_heat