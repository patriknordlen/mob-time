let separator = ",";
exports.isOn = (feature, serverFeatures, mobFeatures) =>
    (serverFeatures + separator + mobFeatures).split(separator)
                                              .some(activeFeature => activeFeature === feature)

exports.activate = (feature, mobFeatures, legalFeatures) =>
    legalFeatures.includes(feature)
        ? mobFeatures + separator + feature
        : mobFeatures

exports.clean = (mobFeatures, legalFeatures) =>
    mobFeatures.split(separator)
               .filter(value => legalFeatures.includes(value))
               .join(separator)