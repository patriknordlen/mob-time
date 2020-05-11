let separator = ",";
exports.isOn = (feature, serverFeatures, mobFeatures) =>
    (serverFeatures + separator + mobFeatures).split(separator)
                                              .some(activeFeature => activeFeature === feature)

exports.activate = (features, mobFeatures, legalFeatures) => {
    return features.split(separator)
                   .filter(feature => legalFeatures.includes(feature))
                   .filter(feature => !mobFeatures.includes(feature))
                   .reduce(
                       (previousValue, currentValue) => previousValue + separator + currentValue,
                       mobFeatures
                   );
}

exports.clean = (mobFeatures, legalFeatures) =>
    mobFeatures.split(separator)
               .filter(value => legalFeatures.includes(value))
               .join(separator)